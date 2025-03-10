
/**
 * Hook para gerenciar o upload e visualização de arquivos de faturas
 * 
 * Este hook encapsula toda a lógica de estado e manipulação de arquivos
 * para upload, remoção e visualização de arquivos de faturas.
 */
import { useState, useCallback } from "react";
import { 
  handleFileUpload, 
  handleFileRemove, 
  getFilePreviewUrl 
} from "./utils/fileHandlers";

export interface FileInfo {
  nome: string | null;
  path: string | null;
  tipo: string | null;
  tamanho: number | null;
}

interface UseFileUploadProps {
  faturaId: string;
  initialFile: FileInfo;
  onFileChange: (nome: string | null, path: string | null, tipo: string | null, tamanho: number | null) => void;
  onStatusChange?: (newStatus: string) => void;
}

export function useFileUpload({ 
  faturaId, 
  initialFile, 
  onFileChange, 
  onStatusChange 
}: UseFileUploadProps) {
  const [file, setFile] = useState<FileInfo>(initialFile);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleUpload = useCallback(async (newFile: File) => {
    setLoading(true);
    try {
      await handleFileUpload(newFile, faturaId, (nome, path, tipo, tamanho) => {
        setFile({ nome, path, tipo, tamanho });
        onFileChange(nome, path, tipo, tamanho);
      }, onStatusChange);
    } finally {
      setLoading(false);
    }
  }, [faturaId, onFileChange, onStatusChange]);

  const handleRemove = useCallback(async () => {
    if (!file.path) return;
    
    setLoading(true);
    try {
      await handleFileRemove(file.path, faturaId, (nome, path, tipo, tamanho) => {
        setFile({ nome, path, tipo, tamanho });
        onFileChange(nome, path, tipo, tamanho);
      });
      setPreviewUrl(null);
    } finally {
      setLoading(false);
    }
  }, [file.path, faturaId, onFileChange]);

  // Nova função que apenas obtém a URL de visualização sem fechar o formulário
  const handleViewFile = useCallback(async () => {
    if (!file.path) {
      return null;
    }
    
    setLoading(true);
    try {
      const url = await getFilePreviewUrl(file.path);
      setPreviewUrl(url);
      return url;
    } finally {
      setLoading(false);
    }
  }, [file.path]);

  return {
    file,
    loading,
    previewUrl,
    setPreviewUrl,
    handleUpload,
    handleRemove,
    handleViewFile
  };
}
