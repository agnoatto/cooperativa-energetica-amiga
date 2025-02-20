
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
    console.log('Iniciando upload do arquivo:', file.name);

    try {
      // Primeiro, vamos verificar se o arquivo já existe e removê-lo se necessário
      const { data: existingFile } = await supabase.storage
        .from('pagamentos')
        .list(`comprovantes/${pagamentoId}`);

      if (existingFile && existingFile.length > 0) {
        console.log('Removendo arquivo existente');
        await supabase.storage
          .from('pagamentos')
          .remove(existingFile.map(f => `comprovantes/${pagamentoId}/${f.name}`));
      }

      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `comprovantes/${pagamentoId}/${fileName}`;

      console.log('Fazendo upload para:', filePath);

      // Upload do arquivo
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pagamentos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        throw uploadError;
      }

      console.log('Upload concluído:', uploadData);

      // Obter URL pública do arquivo
      const { data: publicUrl } = supabase.storage
        .from('pagamentos')
        .getPublicUrl(filePath);

      console.log('URL pública gerada:', publicUrl);

      // Atualizar registro no banco
      const { error: updateError } = await supabase
        .from('pagamentos_usina')
        .update({
          arquivo_comprovante_nome: file.name,
          arquivo_comprovante_path: filePath,
          arquivo_comprovante_tipo: file.type,
          arquivo_comprovante_tamanho: file.size,
        })
        .eq('id', pagamentoId)
        .select();

      if (updateError) {
        console.error('Erro ao atualizar registro:', updateError);
        throw updateError;
      }

      console.log('Registro atualizado com sucesso');
      
      // Teste imediato de acesso ao arquivo
      const { data: testDownload, error: testError } = await supabase.storage
        .from('pagamentos')
        .download(filePath);

      if (testError) {
        console.error('Erro ao testar acesso ao arquivo:', testError);
        throw new Error('Arquivo enviado mas não está acessível');
      }

      toast.success('Arquivo enviado com sucesso!');
      onSuccess();
      onFileChange?.();

    } catch (error: any) {
      console.error('Erro completo:', error);
      toast.error(error.message || 'Erro ao enviar arquivo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (arquivoPath: string, arquivoNome: string) => {
    try {
      console.log('Iniciando download:', arquivoPath);
      
      const { data, error } = await supabase.storage
        .from('pagamentos')
        .download(arquivoPath);

      if (error) {
        console.error('Erro no download:', error);
        throw error;
      }

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = arquivoNome;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log('Download concluído com sucesso');
    } catch (error: any) {
      console.error('Erro ao baixar arquivo:', error);
      toast.error('Erro ao baixar arquivo: ' + error.message);
    }
  };

  const handleRemoveFile = async (arquivoPath: string, pagamentoId: string) => {
    try {
      setIsUploading(true);
      console.log('Removendo arquivo:', arquivoPath);

      const { error: removeError } = await supabase.storage
        .from('pagamentos')
        .remove([arquivoPath]);

      if (removeError) {
        console.error('Erro ao remover arquivo:', removeError);
        throw removeError;
      }

      const { error: updateError } = await supabase
        .from('pagamentos_usina')
        .update({
          arquivo_comprovante_nome: null,
          arquivo_comprovante_path: null,
          arquivo_comprovante_tipo: null,
          arquivo_comprovante_tamanho: null
        })
        .eq('id', pagamentoId);

      if (updateError) {
        console.error('Erro ao atualizar registro:', updateError);
        throw updateError;
      }

      toast.success('Arquivo removido com sucesso!');
      setPdfUrl(null);
      onFileChange?.();
      onSuccess();
      
      console.log('Arquivo removido com sucesso');
    } catch (error: any) {
      console.error('Erro ao remover arquivo:', error);
      toast.error('Erro ao remover arquivo: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePreview = async (arquivoPath: string) => {
    try {
      console.log('Gerando preview para:', arquivoPath);
      
      const { data, error } = await supabase.storage
        .from('pagamentos')
        .createSignedUrl(arquivoPath, 60);

      if (error) {
        console.error('Erro ao gerar URL assinada:', error);
        throw error;
      }

      if (data) {
        console.log('URL assinada gerada:', data.signedUrl);
        setPdfUrl(data.signedUrl);
        setShowPdfPreview(true);
      }
    } catch (error: any) {
      console.error('Erro ao gerar preview:', error);
      toast.error('Erro ao gerar preview: ' + error.message);
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
