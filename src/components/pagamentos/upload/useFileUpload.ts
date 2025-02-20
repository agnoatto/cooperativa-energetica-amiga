
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function useFileUpload(pagamentoId: string, onSuccess: () => void, onFileChange?: () => void) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) {
      toast.error('Nenhum arquivo selecionado');
      return;
    }

    if (file.type !== 'application/pdf') {
      toast.error('Por favor, selecione um arquivo PDF');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('O arquivo deve ter no máximo 10MB');
      return;
    }

    setIsUploading(true);
    console.log('[Upload] Iniciando upload do arquivo:', file.name);

    try {
      // Usar UUID para nome único do arquivo
      const uuid = crypto.randomUUID();
      const fileExt = file.name.split('.').pop();
      const filePath = `comprovantes/${pagamentoId}/${uuid}_${Date.now()}.${fileExt}`;
      
      console.log('[Upload] Tentando fazer upload para:', filePath);
      
      const { error: uploadError } = await supabase.storage
        .from('pagamentos')
        .upload(filePath, file);

      if (uploadError) {
        console.error('[Upload] Erro no upload:', uploadError);
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }

      console.log('[Upload] Upload concluído com sucesso');

      const { data: { publicUrl } } = supabase.storage
        .from('pagamentos')
        .getPublicUrl(filePath);

      console.log('[Upload] URL pública gerada:', publicUrl);

      const { error: updateError } = await supabase
        .from('pagamentos_usina')
        .update({
          arquivo_comprovante_nome: file.name,
          arquivo_comprovante_path: filePath,
          arquivo_comprovante_tipo: file.type,
          arquivo_comprovante_tamanho: file.size,
        })
        .eq('id', pagamentoId);

      if (updateError) {
        console.error('[Upload] Erro ao atualizar registro:', updateError);
        throw new Error(`Erro ao atualizar registro: ${updateError.message}`);
      }

      console.log('[Upload] Registro atualizado com sucesso');
      toast.success('Arquivo enviado com sucesso!');
      onSuccess();
      onFileChange?.();

    } catch (error: any) {
      console.error('[Upload] Erro no processo de upload:', error);
      toast.error(error.message || 'Erro ao enviar arquivo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (arquivoPath: string, arquivoNome: string) => {
    console.log('[Download] Tentando baixar arquivo:', arquivoPath);
    try {
      const { data, error } = await supabase.storage
        .from('pagamentos')
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
      console.log('[Download] Download concluído com sucesso');
    } catch (error: any) {
      console.error('[Download] Erro ao baixar arquivo:', error);
      toast.error('Erro ao baixar arquivo');
    }
  };

  const handleRemoveFile = async (arquivoPath: string, pagamentoId: string) => {
    console.log('[Remover] Tentando remover arquivo:', arquivoPath);
    try {
      setIsUploading(true);

      const { error: removeError } = await supabase.storage
        .from('pagamentos')
        .remove([arquivoPath]);

      if (removeError) throw removeError;

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

      console.log('[Remover] Arquivo removido com sucesso');
      toast.success('Arquivo removido com sucesso!');
      setPdfUrl(null);
      onFileChange?.();
      onSuccess();
    } catch (error: any) {
      console.error('[Remover] Erro ao remover arquivo:', error);
      toast.error('Erro ao remover arquivo');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePreview = async (arquivoPath: string) => {
    console.log('[Preview] Tentando gerar preview:', arquivoPath);
    try {
      const { data, error } = await supabase.storage
        .from('pagamentos')
        .createSignedUrl(arquivoPath, 60);

      if (error) throw error;

      if (data?.signedUrl) {
        console.log('[Preview] URL assinada gerada com sucesso');
        setPdfUrl(data.signedUrl);
        setShowPdfPreview(true);
      }
    } catch (error: any) {
      console.error('[Preview] Erro ao gerar preview:', error);
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
