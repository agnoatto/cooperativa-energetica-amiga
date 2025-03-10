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
  
  useEffect(() => {
    console.log("[useFileUpload] Hook inicializado, faturaId:", faturaId);
    console.log("[useFileUpload] refetchFaturas presente:", !!refetchFaturas);
  }, [faturaId, refetchFaturas]);

  const notifyChanges = (nome: string | null, path: string | null, tipo: string | null, tamanho: number | null) => {
    console.log("[useFileUpload] Notificando mudanças:", { nome, path, tipo, tamanho });
    
    if (onFileChange) {
      console.log("[useFileUpload] Chamando onFileChange");
      onFileChange(nome, path, tipo, tamanho);
    }
    
    if (onSuccess) {
      console.log("[useFileUpload] Chamando onSuccess");
      onSuccess();
    }
    
    if (refetchFaturas) {
      console.log("[useFileUpload] Chamando refetchFaturas");
      refetchFaturas();
    }
  };

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;

    const file = files[0];
    
    if (!validateFile(file)) {
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Enviando arquivo...");
    const fileExt = file.name.split(".").pop()?.toLowerCase();

    try {
      const filePath = `faturas/${faturaId}/${Date.now()}.${fileExt}`;
      
      const { success, error: uploadError } = await uploadFile(STORAGE_BUCKET, filePath, file);

      if (!success) {
        throw uploadError;
      }

      const { success: updateSuccess, error: updateError } = await updateFaturaArquivo(faturaId, {
        nome: file.name,
        path: filePath,
        tipo: file.type,
        tamanho: file.size
      });

      if (!updateSuccess) {
        throw updateError;
      }

      toast.success("Arquivo enviado com sucesso!", { id: toastId });
      
      notifyChanges(file.name, filePath, file.type, file.size);
      
    } catch (error: any) {
      console.error("[useFileUpload] Erro ao processar upload:", error);
      toast.error(`Erro ao fazer upload: ${error.message}`, { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    const toastId = toast.loading("Preparando download...");
    
    try {
      const { data, error } = await downloadFile(STORAGE_BUCKET, filePath);

      if (!data) {
        throw error;
      }

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

  const handleRemoveFile = async (filePath: string, faturaId: string) => {
    const toastId = toast.loading("Removendo arquivo...");
    
    try {
      const { success, error: removeError } = await removeFile(STORAGE_BUCKET, filePath);

      if (!success) {
        throw removeError;
      }

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
      
      notifyChanges(null, null, null, null);
      
    } catch (error: any) {
      console.error("[useFileUpload] Erro ao remover arquivo:", error);
      toast.error(`Erro ao remover: ${error.message}`, { id: toastId });
    }
  };

  const handlePreview = async (filePath: string) => {
    const toastId = toast.loading("Carregando visualização...");
    
    try {
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
