
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

    try {
      // 1. Upload do arquivo
      const filePath = `${pagamentoId}/${Date.now()}_${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('pagamentos')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }

      // 2. Gerar URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('pagamentos')
        .getPublicUrl(filePath);

      if (!publicUrl) {
        throw new Error('Não foi possível gerar a URL pública do arquivo');
      }

      // 3. Atualizar registro no banco
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
        throw new Error(`Erro ao atualizar registro: ${updateError.message}`);
      }

      toast.success('Arquivo enviado com sucesso!');
      onSuccess();
      onFileChange?.();

    } catch (error: any) {
      console.error('Erro no processo de upload:', error);
      toast.error(error.message || 'Erro ao enviar arquivo');
      
      // Tentar limpar o arquivo em caso de erro
      try {
        if (error.message.includes('atualizar registro')) {
          const filePath = `${pagamentoId}/${Date.now()}_${file.name}`;
          await supabase.storage.from('pagamentos').remove([filePath]);
        }
      } catch (cleanupError) {
        console.error('Erro ao limpar arquivo:', cleanupError);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (arquivoPath: string, arquivoNome: string) => {
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
    } catch (error: any) {
      console.error('Erro ao baixar arquivo:', error);
      toast.error('Erro ao baixar arquivo');
    }
  };

  const handleRemoveFile = async (arquivoPath: string, pagamentoId: string) => {
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
      const { data, error } = await supabase.storage
        .from('pagamentos')
        .createSignedUrl(arquivoPath, 60);

      if (error) throw error;

      if (data?.signedUrl) {
        setPdfUrl(data.signedUrl);
        setShowPdfPreview(true);
      }
    } catch (error: any) {
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
