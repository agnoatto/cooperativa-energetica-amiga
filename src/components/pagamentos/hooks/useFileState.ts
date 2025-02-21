
import { useState, useCallback } from 'react';
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PagamentoFormValues } from '../types/pagamento';

interface UseFileStateProps {
  pagamentoId: string;
  form: PagamentoFormValues;
  setForm: (form: PagamentoFormValues) => void;
}

export function useFileState({ pagamentoId, form, setForm }: UseFileStateProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const updateFormWithFile = useCallback((fileName: string | null, filePath: string | null, fileType: string | null, fileSize: number | null) => {
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
    if (!file) {
      console.error("[useFileState] Nenhum arquivo fornecido");
      return;
    }

    console.log("[useFileState] Iniciando upload do arquivo:", { 
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size
    });

    if (file.type !== 'application/pdf') {
      toast.error('Por favor, selecione um arquivo PDF');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('O arquivo deve ter no máximo 10MB');
      return;
    }

    setIsUploading(true);

    try {
      // Verificar se o bucket existe
      const { data: buckets, error: bucketError } = await supabase
        .storage
        .listBuckets();

      if (bucketError) {
        throw new Error(`Erro ao verificar buckets: ${bucketError.message}`);
      }

      const bucketExists = buckets.some(b => b.name === 'contas-energia');
      if (!bucketExists) {
        throw new Error('Bucket contas-energia não encontrado');
      }

      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${pagamentoId}_${Date.now()}.${fileExt}`;
      const filePath = `${pagamentoId}/${fileName}`;

      console.log("[useFileState] Enviando arquivo para storage:", { filePath });

      // Upload do arquivo
      const { error: uploadError } = await supabase.storage
        .from('contas-energia')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }

      console.log("[useFileState] Arquivo enviado com sucesso, atualizando registro no banco");

      // Atualizar registro no banco
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
        throw new Error(`Erro ao atualizar registro: ${updateError.message}`);
      }

      console.log("[useFileState] Registro atualizado com sucesso");

      // Atualizar estado local
      updateFormWithFile(file.name, filePath, file.type, file.size);
      
      // Invalidar queries para atualizar a UI
      await queryClient.invalidateQueries({
        queryKey: ["pagamentos"],
        refetchType: 'all'
      });

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
    console.log("[useFileState] Iniciando remoção do arquivo:", form.arquivo_conta_energia_path);

    try {
      const { error: removeError } = await supabase.storage
        .from('contas-energia')
        .remove([form.arquivo_conta_energia_path]);

      if (removeError) {
        throw new Error(`Erro ao remover arquivo: ${removeError.message}`);
      }

      console.log("[useFileState] Arquivo removido do storage, atualizando registro");

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
        throw new Error(`Erro ao atualizar registro: ${updateError.message}`);
      }

      console.log("[useFileState] Registro atualizado com sucesso");

      updateFormWithFile(null, null, null, null);
      setPdfUrl(null);

      await queryClient.invalidateQueries({
        queryKey: ["pagamentos"],
        refetchType: 'all'
      });

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

      const { data, error } = await supabase.storage
        .from('contas-energia')
        .createSignedUrl(form.arquivo_conta_energia_path, 3600);

      if (error) {
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
