
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function useFileUpload(faturaId: string, onSuccess: () => void) {
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
      const fileName = `${faturaId}_${Date.now()}.${fileExt}`;
      const filePath = `${faturaId}/${fileName}`;

      // Fazer upload do arquivo
      const { error: uploadError } = await supabase.storage
        .from('faturas_concessionaria')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Atualizar fatura com dados do novo arquivo
      const { error: updateError } = await supabase
        .from('faturas')
        .update({
          arquivo_concessionaria_nome: file.name,
          arquivo_concessionaria_path: filePath,
          arquivo_concessionaria_tipo: file.type,
          arquivo_concessionaria_tamanho: file.size
        })
        .eq('id', faturaId);

      if (updateError) throw updateError;

      toast.success('Arquivo enviado com sucesso!');
      onSuccess();

      // Obter URL do arquivo para visualização
      const { data: urlData } = await supabase.storage
        .from('faturas_concessionaria')
        .createSignedUrl(filePath, 60);

      if (urlData) {
        setPdfUrl(urlData.signedUrl);
        setShowPdfPreview(true);
      }
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
        .from('faturas_concessionaria')
        .download(arquivoPath);

      if (error) throw error;

      // Criar URL do blob e iniciar download
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = arquivoNome || 'conta-energia.pdf';
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      console.error('Erro ao baixar arquivo:', error);
      toast.error('Erro ao baixar arquivo');
    }
  };

  const handleRemoveFile = async (arquivoPath: string, faturaId: string) => {
    try {
      setIsUploading(true);

      // Remover arquivo do storage
      const { error: removeError } = await supabase.storage
        .from('faturas_concessionaria')
        .remove([arquivoPath]);

      if (removeError) throw removeError;

      // Limpar dados do arquivo na fatura
      const { error: updateError } = await supabase
        .from('faturas')
        .update({
          arquivo_concessionaria_nome: null,
          arquivo_concessionaria_path: null,
          arquivo_concessionaria_tipo: null,
          arquivo_concessionaria_tamanho: null
        })
        .eq('id', faturaId);

      if (updateError) throw updateError;

      toast.success('Arquivo removido com sucesso!');
      onSuccess();
      setPdfUrl(null);
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
        .from('faturas_concessionaria')
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
