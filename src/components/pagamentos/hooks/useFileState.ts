
import { useState, useCallback } from 'react';
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SIGNED_URL_EXPIRY } from './constants';
import { UseFileStateProps, FileMetadata } from './types/fileState';
import { verifyBucketExists, uploadFileToStorage, removeFileFromStorage, createFileSignedUrl } from './utils/storageUtils';
import { validateFile, generateFilePath } from './utils/fileValidation';

export function useFileState({ pagamentoId, form, setForm }: UseFileStateProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const updateFormWithFile = useCallback(({ fileName, filePath, fileType, fileSize }: FileMetadata) => {
    console.log("[useFileState] Atualizando form com arquivo:", { fileName, filePath, fileType, fileSize });
    setForm({
      ...form,
      arquivo_conta_energia_nome: fileName,
      arquivo_conta_energia_path: filePath,
      arquivo_conta_energia_tipo: fileType,
      arquivo_conta_energia_tamanho: fileSize
    });
  }, [form, setForm]);

  const handleFileUpload = useCallback(async (file: File) => {
    console.log("[useFileState] Iniciando processo de upload para:", file.name);
    
    if (!file) {
      console.error("[useFileState] Nenhum arquivo fornecido");
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      console.error("[useFileState] Erro de validação:", validationError);
      toast.error(validationError);
      return;
    }

    setIsUploading(true);

    try {
      console.log("[useFileState] Verificando existência do bucket");
      await verifyBucketExists();
      
      const filePath = generateFilePath(pagamentoId, file.name);
      console.log("[useFileState] Caminho do arquivo gerado:", filePath);

      console.log("[useFileState] Iniciando upload para storage");
      const { error: uploadError } = await uploadFileToStorage(filePath, file);
      if (uploadError) {
        console.error("[useFileState] Erro no upload:", uploadError);
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }

      console.log("[useFileState] Upload concluído, atualizando registro no banco");
      const { error: updateError } = await supabase
        .from('pagamentos_usina')
        .update({
          arquivo_conta_energia_nome: file.name,
          arquivo_conta_energia_path: filePath,
          arquivo_conta_energia_tipo: file.type,
          arquivo_conta_energia_tamanho: file.size
        })
        .eq('id', pagamentoId);

      if (updateError) {
        console.error("[useFileState] Erro ao atualizar registro:", updateError);
        throw new Error(`Erro ao atualizar registro: ${updateError.message}`);
      }

      updateFormWithFile({
        fileName: file.name,
        filePath,
        fileType: file.type,
        fileSize: file.size
      });
      
      await queryClient.invalidateQueries({
        queryKey: ["pagamentos"],
        refetchType: 'all'
      });

      console.log("[useFileState] Upload finalizado com sucesso");
      toast.success('Arquivo enviado com sucesso!');
    } catch (error: any) {
      console.error('[useFileState] Erro no processo de upload:', error);
      toast.error(`Erro ao enviar arquivo: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  }, [pagamentoId, updateFormWithFile, queryClient]);

  const handleRemoveFile = useCallback(async () => {
    if (!form.arquivo_conta_energia_path) {
      console.log("[useFileState] Nenhum arquivo para remover");
      return;
    }

    setIsUploading(true);
    try {
      console.log("[useFileState] Iniciando remoção do arquivo:", form.arquivo_conta_energia_path);
      
      const { error: removeError } = await removeFileFromStorage(form.arquivo_conta_energia_path);
      if (removeError) {
        console.error("[useFileState] Erro ao remover arquivo:", removeError);
        throw new Error(`Erro ao remover arquivo: ${removeError.message}`);
      }

      console.log("[useFileState] Arquivo removido, atualizando registro");
      const { error: updateError } = await supabase
        .from('pagamentos_usina')
        .update({
          arquivo_conta_energia_nome: null,
          arquivo_conta_energia_path: null,
          arquivo_conta_energia_tipo: null,
          arquivo_conta_energia_tamanho: null
        })
        .eq('id', pagamentoId);

      if (updateError) {
        console.error("[useFileState] Erro ao atualizar registro após remoção:", updateError);
        throw new Error(`Erro ao atualizar registro: ${updateError.message}`);
      }

      updateFormWithFile({
        fileName: null,
        filePath: null,
        fileType: null,
        fileSize: null
      });
      setPdfUrl(null);

      await queryClient.invalidateQueries({
        queryKey: ["pagamentos"],
        refetchType: 'all'
      });

      console.log("[useFileState] Remoção finalizada com sucesso");
      toast.success('Arquivo removido com sucesso!');
    } catch (error: any) {
      console.error('[useFileState] Erro ao remover arquivo:', error);
      toast.error(`Erro ao remover arquivo: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  }, [pagamentoId, form.arquivo_conta_energia_path, updateFormWithFile, queryClient]);

  const handlePreview = useCallback(async () => {
    if (!form.arquivo_conta_energia_path) {
      console.log("[useFileState] Nenhum arquivo para visualizar");
      return null;
    }

    try {
      console.log("[useFileState] Gerando URL de preview para:", form.arquivo_conta_energia_path);
      const { data, error } = await createFileSignedUrl(form.arquivo_conta_energia_path, SIGNED_URL_EXPIRY);

      if (error) {
        console.error("[useFileState] Erro ao gerar URL assinada:", error);
        throw new Error(`Erro ao gerar URL assinada: ${error.message}`);
      }

      console.log("[useFileState] URL de preview gerada com sucesso");
      setPdfUrl(data.signedUrl);
      return data.signedUrl;
    } catch (error: any) {
      console.error('[useFileState] Erro ao gerar preview:', error);
      toast.error(`Erro ao gerar preview do arquivo: ${error.message}`);
      return null;
    }
  }, [form.arquivo_conta_energia_path]);

  return {
    isUploading,
    pdfUrl,
    setPdfUrl,
    handleFileUpload,
    handleRemoveFile,
    handlePreview
  };
}
