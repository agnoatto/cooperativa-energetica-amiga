
/**
 * Hook para gerenciamento de upload e visualização de arquivos de faturas
 * Este hook fornece funcionalidades para upload, download, visualização e
 * remoção de arquivos relacionados às faturas de concessionárias
 */

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { STORAGE_BUCKET } from "./constants";
import { validateFile } from "./utils/fileValidation";
import { uploadFile, getSignedUrl, downloadFile, removeFile } from "./utils/storageUtils";
import { updateFaturaArquivo } from "./utils/faturaUtils";

interface UseFileUploadOptions {
  onSuccess?: () => void;
  onFileChange?: (nome: string | null, path: string | null, tipo: string | null, tamanho: number | null) => void;
  refetchFaturas?: () => void;
}

export function useFileUpload(
  faturaId: string,
  options?: UseFileUploadOptions
) {
  const { onSuccess, onFileChange, refetchFaturas } = options || {};
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  
  // Log para debug quando as props mudam
  useEffect(() => {
    console.log("[useFileUpload] Hook inicializado, faturaId:", faturaId);
    console.log("[useFileUpload] refetchFaturas presente:", !!refetchFaturas);
  }, [faturaId, refetchFaturas]);

  // Função para atualizar o estado e notificar os componentes pai
  const notifyChanges = (nome: string | null, path: string | null, tipo: string | null, tamanho: number | null) => {
    console.log("[useFileUpload] Notificando mudanças:", { nome, path, tipo, tamanho });
    
    // Notificar componente pai sobre alteração de arquivo
    if (onFileChange) {
      console.log("[useFileUpload] Chamando onFileChange");
      onFileChange(nome, path, tipo, tamanho);
    }
    
    // Callback de sucesso
    if (onSuccess) {
      console.log("[useFileUpload] Chamando onSuccess");
      onSuccess();
    }
    
    // Forçar atualização dos dados
    if (refetchFaturas) {
      console.log("[useFileUpload] Chamando refetchFaturas");
      refetchFaturas();
    }
  };

  // Função para lidar com upload de arquivo
  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;

    const file = files[0];
    
    // Validar arquivo
    if (!validateFile(file)) {
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Enviando arquivo...");
    const fileExt = file.name.split(".").pop()?.toLowerCase();

    try {
      // Criar path único para o arquivo
      const filePath = `faturas/${faturaId}/${Date.now()}.${fileExt}`;
      
      // Upload para o storage
      const { success, error: uploadError } = await uploadFile(STORAGE_BUCKET, filePath, file);

      if (!success) {
        throw uploadError;
      }

      // Atualizar a fatura com informações do arquivo
      const { success: updateSuccess, error: updateError } = await updateFaturaArquivo(faturaId, {
        nome: file.name,
        path: filePath,
        tipo: file.type,
        tamanho: file.size
      });

      if (!updateSuccess) {
        throw updateError;
      }

      // Notificar sucesso
      toast.success("Arquivo enviado com sucesso!", { id: toastId });
      
      // Notificar mudanças
      notifyChanges(file.name, filePath, file.type, file.size);
      
    } catch (error: any) {
      console.error("[useFileUpload] Erro ao processar upload:", error);
      toast.error(`Erro ao fazer upload: ${error.message}`, { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  // Função para baixar arquivo
  const handleDownload = async (filePath: string, fileName: string) => {
    const toastId = toast.loading("Preparando download...");
    
    try {
      // Buscar o arquivo
      const { data, error } = await downloadFile(STORAGE_BUCKET, filePath);

      if (!data) {
        throw error;
      }

      // Criar URL para download e simular clique em link
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Download iniciado", { id: toastId });
    } catch (error: any) {
      console.error("[useFileUpload] Erro ao baixar arquivo:", error);
      toast.error(`Erro ao baixar: ${error.message}`, { id: toastId });
    }
  };

  // Função para remover arquivo
  const handleRemoveFile = async (filePath: string, faturaId: string) => {
    const toastId = toast.loading("Removendo arquivo...");
    
    try {
      // Remover do storage
      const { success, error: removeError } = await removeFile(STORAGE_BUCKET, filePath);

      if (!success) {
        throw removeError;
      }

      // Atualizar a fatura removendo informações do arquivo
      const { success: updateSuccess, error: updateError } = await updateFaturaArquivo(faturaId, {
        nome: null,
        path: null,
        tipo: null,
        tamanho: null
      });

      if (!updateSuccess) {
        throw updateError;
      }

      toast.success("Arquivo removido com sucesso", { id: toastId });
      
      // Notificar mudanças
      notifyChanges(null, null, null, null);
      
    } catch (error: any) {
      console.error("[useFileUpload] Erro ao remover arquivo:", error);
      toast.error(`Erro ao remover: ${error.message}`, { id: toastId });
    }
  };

  // Função para pré-visualizar PDF
  const handlePreview = async (filePath: string) => {
    const toastId = toast.loading("Carregando visualização...");
    
    try {
      // Obter URL assinada
      const { url, error } = await getSignedUrl(STORAGE_BUCKET, filePath);

      if (!url) {
        throw error || new Error("Não foi possível gerar a URL do documento");
      }

      setPdfUrl(url);
      setShowPdfPreview(true);
      toast.success("Documento carregado", { id: toastId });
    } catch (error: any) {
      console.error("[useFileUpload] Erro ao obter URL do PDF:", error);
      toast.error(`Erro ao carregar visualização: ${error.message}`, { id: toastId });
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
