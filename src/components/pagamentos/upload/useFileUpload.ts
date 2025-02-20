
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function useFileUpload(pagamentoId: string, onSuccess: () => void, onFileChange?: () => void) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validar tipo do arquivo
    if (file.type !== 'application/pdf') {
      toast.error('Por favor, selecione um arquivo PDF');
      return;
    }

    // Validar tamanho (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('O arquivo deve ter no máximo 10MB');
      return;
    }

    setIsUploading(true);

    try {
      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${pagamentoId}_${Date.now()}.${fileExt}`;
      const filePath = `${pagamentoId}/${fileName}`;

      // Fazer upload do arquivo
      const { error: uploadError } = await supabase.storage
        .from('pagamentos_comprovantes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Atualizar pagamento com dados do novo arquivo
      const { error: updateError } = await supabase
        .from('pagamentos_usina')
        .update({
          arquivo_comprovante_nome: file.name,
          arquivo_comprovante_path: filePath,
          arquivo_comprovante_tipo: file.type,
          arquivo_comprovante_tamanho: file.size
        })
        .eq('id', pagamentoId);

      if (updateError) throw updateError;

      toast.success('Arquivo enviado com sucesso!');
      onSuccess();
      onFileChange?.();

    } catch (error: any) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao enviar arquivo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (arquivoPath: string, arquivoNome: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('pagamentos_comprovantes')
        .download(arquivoPath);

      if (error) throw error;

      // Criar URL do blob e iniciar download
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = arquivoNome || 'comprovante.pdf';
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      console.error('Erro ao baixar arquivo:', error);
      toast.error('Erro ao baixar arquivo');
    }
  };

  const handleRemoveFile = async (arquivoPath: string, pagamentoId: string) => {
    try {
      setIsUploading(true);

      // Remover arquivo do storage
      const { error: removeError } = await supabase.storage
        .from('pagamentos_comprovantes')
        .remove([arquivoPath]);

      if (removeError) throw removeError;

      // Limpar dados do arquivo no pagamento
      const { error: updateError } = await supabase
        .from('pagamentos_usina')
        .update({
          arquivo_comprovante_nome: null,
          arquivo_comprovante_path: null,
          arquivo_comprovante_tipo: null,
          arquivo_comprovante_tamanho: null
        })
        .eq('id', pagamentoId);

      if (updateError) throw updateError;

      toast.success('Arquivo removido com sucesso!');
      setPdfUrl(null);
      onFileChange?.();
      onSuccess();
    } catch (error: any) {
      console.error('Erro ao remover arquivo:', error);
      toast.error('Erro ao remover arquivo');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePreview = async (arquivoPath: string) => {
    try {
      const { data } = await supabase.storage
        .from('pagamentos_comprovantes')
        .createSignedUrl(arquivoPath, 60);

      if (data) {
        setPdfUrl(data.signedUrl);
        setShowPdfPreview(true);
      }
    } catch (error) {
      console.error('Erro ao gerar preview:', error);
      toast.error('Erro ao gerar preview do arquivo');
    }
  };

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
