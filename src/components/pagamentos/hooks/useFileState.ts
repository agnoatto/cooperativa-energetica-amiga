
/**
 * Hook para gerenciamento de arquivos em pagamentos
 * 
 * Este hook centraliza a lógica de estado e operações relacionadas a arquivos
 * de contas de energia nos pagamentos de usinas
 */

import { useState, useCallback } from 'react';
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UseFileStateProps, FileMetadata } from './types/fileState';
import { validateFile, generateFilePath } from './utils/fileValidation';
import { 
  uploadFile, 
  updateMetadataInDB, 
  getSignedUrl, 
  removeFile, 
  downloadFile 
} from './utils/storageUtils';

export function useFileState({ pagamentoId, form, setForm }: UseFileStateProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Atualizar o formulário com informações do arquivo
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

  // Lidar com upload de arquivo
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
      const filePath = generateFilePath(pagamentoId, file.name);
      console.log("[useFileState] Caminho do arquivo gerado:", filePath);

      // Upload do arquivo para o Storage
      const { success: uploadSuccess, error: uploadError } = await uploadFile(filePath, file);

      if (!uploadSuccess) {
        throw uploadError || new Error("Erro no upload");
      }

      // Atualização do registro no banco
      const { success: updateSuccess, error: updateError } = await updateMetadataInDB(pagamentoId, {
        nome: file.name,
        path: filePath,
        tipo: file.type,
        tamanho: file.size
      });

      if (!updateSuccess) {
        // Se falhar a atualização do banco, remove o arquivo do Storage
        await removeFile(filePath);
        throw updateError || new Error("Erro ao atualizar registro");
      }

      // Atualiza o formulário local
      updateFormWithFile({
        fileName: file.name,
        filePath,
        fileType: file.type,
        fileSize: file.size
      });
      
      // Invalida as queries para forçar atualização dos dados
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

  // Lidar com remoção de arquivo
  const handleRemoveFile = useCallback(async () => {
    if (!form.arquivo_conta_energia_path) {
      console.log("[useFileState] Nenhum arquivo para remover");
      return;
    }

    setIsUploading(true);
    try {
      console.log("[useFileState] Iniciando remoção do arquivo:", form.arquivo_conta_energia_path);
      
      // Remove o arquivo do Storage
      const { success: removeSuccess, error: removeError } = await removeFile(form.arquivo_conta_energia_path);

      if (!removeSuccess) {
        throw removeError || new Error("Erro ao remover arquivo");
      }

      // Atualiza o registro no banco
      const { success: updateSuccess, error: updateError } = await updateMetadataInDB(pagamentoId, {
        nome: null,
        path: null,
        tipo: null,
        tamanho: null
      });

      if (!updateSuccess) {
        throw updateError || new Error("Erro ao atualizar registro após remoção");
      }

      // Atualiza o formulário local
      updateFormWithFile({
        fileName: null,
        filePath: null,
        fileType: null,
        fileSize: null
      });
      setPdfUrl(null);

      // Invalida as queries para forçar atualização dos dados
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

  // Lidar com visualização de arquivo
  const handlePreview = useCallback(async () => {
    if (!form.arquivo_conta_energia_path) {
      console.log("[useFileState] Nenhum arquivo para visualizar");
      return null;
    }

    try {
      console.log("[useFileState] Gerando URL de preview para:", form.arquivo_conta_energia_path);
      const { url, error } = await getSignedUrl(form.arquivo_conta_energia_path);

      if (!url) {
        throw error || new Error("Erro ao gerar URL assinada");
      }

      console.log("[useFileState] URL de preview gerada com sucesso");
      setPdfUrl(url);
      return url;
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
