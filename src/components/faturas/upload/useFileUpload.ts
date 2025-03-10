
/**
 * Hook para gerenciamento de upload e visualização de arquivos de faturas
 * Este hook fornece funcionalidades para upload, download, visualização e
 * remoção de arquivos relacionados às faturas de concessionárias
 */

import { useState, useEffect } from "react";
import { handleDownload, handleRemoveFile, handlePreview } from "./utils/fileHandlers";
import { processFileUpload, NotifyCallbacks } from "./utils/uploadHandlers";

interface UseFileUploadOptions {
  onSuccess?: () => void;
  onFileChange?: (nome: string | null, path: string | null, tipo: string | null, tamanho: number | null) => void;
  refetchFaturas?: () => void;
}

export function useFileUpload(
  faturaId: string,
  options?: UseFileUploadOptions
) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  
  useEffect(() => {
    console.log("[useFileUpload] Hook inicializado, faturaId:", faturaId);
    console.log("[useFileUpload] refetchFaturas presente:", !!options?.refetchFaturas);
  }, [faturaId, options?.refetchFaturas]);

  // Preparar callbacks para notificações
  const callbacks: NotifyCallbacks = {
    onFileChange: options?.onFileChange,
    onSuccess: options?.onSuccess,
    refetchFaturas: options?.refetchFaturas
  };

  // Função para controlar upload de arquivos
  const handleFileUpload = async (files: File[]) => {
    setIsUploading(true);
    try {
      await processFileUpload(files, faturaId, callbacks);
    } finally {
      setIsUploading(false);
    }
  };

  // Função para visualizar PDF
  const handlePdfPreview = async (filePath: string) => {
    const { url } = await handlePreview(filePath);
    if (url) {
      setPdfUrl(url);
      setShowPdfPreview(true);
    }
  };

  // Função para remover arquivo com callbacks
  const handleFileRemoval = async (filePath: string, faturaId: string) => {
    const { success } = await handleRemoveFile(filePath, faturaId);
    if (success && options) {
      if (options.onFileChange) {
        options.onFileChange(null, null, null, null);
      }
      if (options.onSuccess) {
        options.onSuccess();
      }
      if (options.refetchFaturas) {
        options.refetchFaturas();
      }
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
    handleRemoveFile: handleFileRemoval,
    handlePreview: handlePdfPreview,
  };
}
