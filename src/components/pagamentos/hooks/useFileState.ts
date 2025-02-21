
import { useState, useCallback } from 'react';
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PagamentoFormValues, PagamentoStatus } from '../types/pagamento';

interface UseFileStateProps {
  pagamentoId: string;
  form: PagamentoFormValues;
  setForm: (form: PagamentoFormValues) => void;
}

export function useFileState({ pagamentoId, form, setForm }: UseFileStateProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const updateFormWithFile = useCallback((fileName: string | null, filePath: string | null) => {
    console.log("[useFileState] Atualizando form com arquivo:", { fileName, filePath });
    setForm({
      ...form,
      arquivo_conta_energia_nome: fileName,
      arquivo_conta_energia_path: filePath,
      arquivo_conta_energia_tipo: fileName ? 'application/pdf' : null,
      arquivo_conta_energia_tamanho: null
    });
  }, [form, setForm]);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Por favor, selecione um arquivo PDF');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('O arquivo deve ter no máximo 10MB');
      return;
    }

    setIsUploading(true);
    console.log("[useFileState] Iniciando upload do arquivo:", { fileName: file.name });

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${pagamentoId}_${Date.now()}.${fileExt}`;
      const filePath = `${pagamentoId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('contas-energia')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from('pagamentos_usina')
        .update({
          arquivo_conta_energia_nome: file.name,
          arquivo_conta_energia_path: filePath,
          arquivo_conta_energia_tipo: file.type,
          arquivo_conta_energia_tamanho: file.size,
          status: form.status || 'pendente'
        })
        .eq('id', pagamentoId);

      if (updateError) throw updateError;

      console.log("[useFileState] Arquivo enviado com sucesso");
      updateFormWithFile(file.name, filePath);
      
      await queryClient.invalidateQueries({
        queryKey: ["pagamentos"],
        refetchType: 'all'
      });

      toast.success('Arquivo enviado com sucesso!');
    } catch (error: any) {
      console.error('[useFileState] Erro no upload:', error);
      toast.error('Erro ao enviar arquivo');
    } finally {
      setIsUploading(false);
    }
  }, [pagamentoId, form.status, updateFormWithFile, queryClient]);

  const handleRemoveFile = useCallback(async () => {
    if (!form.arquivo_conta_energia_path) return;

    setIsUploading(true);
    console.log("[useFileState] Iniciando remoção do arquivo");

    try {
      const { error: removeError } = await supabase.storage
        .from('contas-energia')
        .remove([form.arquivo_conta_energia_path]);

      if (removeError) throw removeError;

      const { error: updateError } = await supabase
        .from('pagamentos_usina')
        .update({
          arquivo_conta_energia_nome: null,
          arquivo_conta_energia_path: null,
          arquivo_conta_energia_tipo: null,
          arquivo_conta_energia_tamanho: null
        })
        .eq('id', pagamentoId);

      if (updateError) throw updateError;

      console.log("[useFileState] Arquivo removido com sucesso");
      updateFormWithFile(null, null);
      setPdfUrl(null);

      await queryClient.invalidateQueries({
        queryKey: ["pagamentos"],
        refetchType: 'all'
      });

      toast.success('Arquivo removido com sucesso!');
    } catch (error: any) {
      console.error('[useFileState] Erro ao remover arquivo:', error);
      toast.error('Erro ao remover arquivo');
    } finally {
      setIsUploading(false);
    }
  }, [pagamentoId, form.arquivo_conta_energia_path, updateFormWithFile, queryClient]);

  const handlePreview = useCallback(async () => {
    if (!form.arquivo_conta_energia_path) return null;

    try {
      const { data, error } = await supabase.storage
        .from('contas-energia')
        .createSignedUrl(form.arquivo_conta_energia_path, 3600);

      if (error) throw error;

      setPdfUrl(data.signedUrl);
      return data.signedUrl;
    } catch (error) {
      console.error('[useFileState] Erro ao gerar preview:', error);
      toast.error('Erro ao gerar preview do arquivo');
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
