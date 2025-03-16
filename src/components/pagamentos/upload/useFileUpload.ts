
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface UseFileUploadProps {
  pagamentoId: string;
  onSuccess: (fileName: string, filePath: string) => void;
  onFileRemoved: () => void;
}

export function useFileUpload({ pagamentoId, onSuccess, onFileRemoved }: UseFileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const queryClient = useQueryClient();

  /**
   * Gera um nome de arquivo seguro para armazenamento
   * @param file Arquivo original
   * @returns Nome de arquivo seguro com extensão
   */
  const generateSafeFileName = (file: File): string => {
    // Extrair a extensão do arquivo original, ou usar 'pdf' como padrão
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'pdf';
    
    // Gerar um UUID parcial para garantir unicidade
    const randomId = crypto.randomUUID().substring(0, 8);
    
    // Combinar ID do pagamento, timestamp e ID aleatório
    return `${randomId}_${Date.now()}.${fileExt}`;
  };

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

    try {
      // Gerar um nome de arquivo seguro
      const safeFileName = generateSafeFileName(file);
      const filePath = `${pagamentoId}/${safeFileName}`;

      const { error: uploadError } = await supabase.storage
        .from('contas-energia')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from('pagamentos_usina')
        .update({
          arquivo_conta_energia_nome: file.name, // Nome original apenas para exibição
          arquivo_conta_energia_path: filePath,  // Caminho seguro para storage
          arquivo_conta_energia_tipo: file.type,
          arquivo_conta_energia_tamanho: file.size
        })
        .eq('id', pagamentoId);

      if (updateError) throw updateError;

      await queryClient.invalidateQueries({
        queryKey: ["pagamentos"],
        refetchType: 'all'
      });

      toast.success('Arquivo enviado com sucesso!');
      onSuccess(file.name, filePath);
    } catch (error: any) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao enviar arquivo');
    } finally {
      setIsUploading(false);
    }
  }, [pagamentoId, onSuccess, queryClient]);

  const handleDownload = useCallback(async (arquivoPath: string, arquivoNome: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('contas-energia')
        .download(arquivoPath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = arquivoNome;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      console.error('Erro ao baixar arquivo:', error);
      toast.error('Erro ao baixar arquivo');
    }
  }, []);

  const handleRemoveFile = useCallback(async (arquivoPath: string, pagamentoId: string) => {
    try {
      setIsUploading(true);

      const { error: removeError } = await supabase.storage
        .from('contas-energia')
        .remove([arquivoPath]);

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

      await queryClient.invalidateQueries({
        queryKey: ["pagamentos"],
        refetchType: 'all'
      });

      toast.success('Arquivo removido com sucesso!');
      onFileRemoved();
      setPdfUrl(null);
      setShowPdfPreview(false);
    } catch (error: any) {
      console.error('Erro ao remover arquivo:', error);
      toast.error('Erro ao remover arquivo');
    } finally {
      setIsUploading(false);
    }
  }, [onFileRemoved, queryClient]);

  const handlePreview = useCallback(async (arquivoPath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('contas-energia')
        .createSignedUrl(arquivoPath, 3600);

      if (error) throw error;

      if (data?.signedUrl) {
        setPdfUrl(data.signedUrl);
        setShowPdfPreview(true);
      } else {
        throw new Error('URL não gerada');
      }
    } catch (error) {
      console.error('Erro ao gerar preview:', error);
      toast.error('Erro ao gerar preview do arquivo');
    }
  }, []);

  return {
    isUploading,
    isDragging,
    showPdfPreview,
    pdfUrl,
    setIsDragging,
    setShowPdfPreview,
    handleFileUpload,
    handleDownload,
    handleRemoveFile,
    handlePreview,
  };
}
