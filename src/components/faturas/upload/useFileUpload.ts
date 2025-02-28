
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  SIGNED_URL_EXPIRY, 
  STORAGE_BUCKET, 
  MAX_FILE_SIZE, 
  FILE_TYPE,
  RETRY_ATTEMPTS,
  RETRY_DELAY,
  VALID_FILE_CHARS
} from "./constants";

type RetryFunction = () => Promise<any>;

const retry = async (fn: RetryFunction, attempts: number = RETRY_ATTEMPTS): Promise<any> => {
  try {
    return await fn();
  } catch (error) {
    if (attempts === 1) throw error;
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    return retry(fn, attempts - 1);
  }
};

const verifyFileExists = async (path: string): Promise<boolean> => {
  try {
    const { data } = await supabase.storage
      .from(STORAGE_BUCKET)
      .download(path);
    return !!data;
  } catch (error) {
    console.error('Erro ao verificar arquivo:', error);
    return false;
  }
};

export function useFileUpload(
  faturaId: string, 
  onSuccess: () => void, 
  onFileChange?: (nome: string | null, path: string | null, tipo: string | null, tamanho: number | null) => void
) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const generateSignedUrl = async (filePath: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(filePath, SIGNED_URL_EXPIRY);

      if (error) throw error;
      return data.signedUrl;
    } catch (error: any) {
      console.error('Erro ao gerar URL assinada:', error);
      return null;
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) {
      toast.error('Nenhum arquivo selecionado');
      return;
    }

    // Validações
    if (file.type !== FILE_TYPE) {
      toast.error('Por favor, selecione um arquivo PDF');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('O arquivo deve ter no máximo 10MB');
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading('Enviando arquivo...');

    try {
      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const sanitizedName = file.name.replace(VALID_FILE_CHARS, '');
      const fileName = `${faturaId}_${Date.now()}.${fileExt}`;
      const filePath = `${faturaId}/${fileName}`;

      // Upload do arquivo com retry
      await retry(async () => {
        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;
      });

      // Atualizar fatura com dados do novo arquivo
      const { error: updateError } = await supabase
        .from('faturas')
        .update({
          arquivo_concessionaria_nome: sanitizedName,
          arquivo_concessionaria_path: filePath,
          arquivo_concessionaria_tipo: file.type,
          arquivo_concessionaria_tamanho: file.size
        })
        .eq('id', faturaId);

      if (updateError) throw updateError;

      toast.success('Arquivo enviado com sucesso!', { id: toastId });
      onSuccess();
      
      // Atualiza os estados no componente pai
      if (onFileChange) {
        onFileChange(sanitizedName, filePath, file.type, file.size);
      }
    } catch (error: any) {
      console.error('Erro no upload:', error);
      toast.error(`Erro ao enviar arquivo: ${error.message}`, { id: toastId });
      
      // Tentar limpar arquivo do storage em caso de erro
      if (error.message.includes('database')) {
        try {
          await supabase.storage
            .from(STORAGE_BUCKET)
            .remove([`${faturaId}/${file.name}`]);
        } catch (cleanupError) {
          console.error('Erro ao limpar arquivo:', cleanupError);
        }
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (arquivoPath: string, arquivoNome: string) => {
    const toastId = toast.loading('Preparando download...');

    try {
      // Verificar se arquivo existe
      const exists = await verifyFileExists(arquivoPath);
      if (!exists) {
        throw new Error('Arquivo não encontrado');
      }

      // Gerar URL assinada com retry
      const signedUrl = await retry(async () => {
        const url = await generateSignedUrl(arquivoPath);
        if (!url) throw new Error('Erro ao gerar URL de download');
        return url;
      });

      if (!signedUrl) {
        throw new Error('Não foi possível gerar o link de download');
      }

      // Criar link de download
      const link = document.createElement('a');
      link.href = signedUrl;
      link.download = arquivoNome || 'conta-energia.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Download iniciado!', { id: toastId });
    } catch (error: any) {
      console.error('Erro ao baixar arquivo:', error);
      toast.error(`Erro ao baixar arquivo: ${error.message}`, { id: toastId });
    }
  };

  const handleRemoveFile = async (arquivoPath: string, faturaId: string) => {
    const toastId = toast.loading('Removendo arquivo...');
    setIsUploading(true);

    try {
      // Verificar se arquivo existe
      const exists = await verifyFileExists(arquivoPath);
      if (!exists) {
        throw new Error('Arquivo não encontrado');
      }

      // Remover arquivo do storage com retry
      await retry(async () => {
        const { error: removeError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .remove([arquivoPath]);

        if (removeError) throw removeError;
      });

      // Atualizar fatura
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

      toast.success('Arquivo removido com sucesso!', { id: toastId });
      setPdfUrl(null);
      setShowPdfPreview(false); // Fechar o preview se estiver aberto
      
      // Atualiza os estados no componente pai
      if (onFileChange) {
        onFileChange(null, null, null, null);
      }
      
      // Chamar callback de sucesso
      onSuccess();
    } catch (error: any) {
      console.error('Erro ao remover arquivo:', error);
      toast.error(`Erro ao remover arquivo: ${error.message}`, { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handlePreview = async (arquivoPath: string) => {
    const toastId = toast.loading('Carregando visualização...');

    try {
      // Verificar se arquivo existe
      const exists = await verifyFileExists(arquivoPath);
      if (!exists) {
        throw new Error('Arquivo não encontrado');
      }

      // Gerar URL assinada com retry
      const signedUrl = await retry(async () => {
        const url = await generateSignedUrl(arquivoPath);
        if (!url) throw new Error('Erro ao gerar URL de visualização');
        return url;
      });

      if (signedUrl) {
        setPdfUrl(signedUrl);
        setShowPdfPreview(true);
        toast.success('PDF carregado com sucesso!', { id: toastId });
      } else {
        throw new Error('Não foi possível gerar a visualização');
      }
    } catch (error: any) {
      console.error('Erro ao gerar preview:', error);
      toast.error(`Erro ao gerar preview: ${error.message}`, { id: toastId });
      setPdfUrl(null);
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
