
/**
 * Utilitários para manipulação de arquivos de faturas
 * Este módulo contém funções para download, preview e remoção de arquivos
 * relacionados às faturas de concessionárias
 */

import { toast } from "sonner";
import { STORAGE_BUCKET } from "../constants";
import { downloadFile, getSignedUrl, removeFile } from "./storageUtils";
import { updateFaturaArquivo } from "./faturaUtils";

// Função para download de arquivo
export const handleDownload = async (filePath: string, fileName: string) => {
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
    return { success: true, error: null };
  } catch (error: any) {
    console.error("[fileHandlers] Erro ao baixar arquivo:", error);
    toast.error(`Erro ao baixar: ${error.message}`, { id: toastId });
    return { success: false, error };
  }
};

// Função para remover arquivo
export const handleRemoveFile = async (filePath: string, faturaId: string) => {
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
    return { success: true, error: null };
  } catch (error: any) {
    console.error("[fileHandlers] Erro ao remover arquivo:", error);
    toast.error(`Erro ao remover: ${error.message}`, { id: toastId });
    return { success: false, error };
  }
};

// Função para gerar preview de arquivo
export const handlePreview = async (filePath: string) => {
  const toastId = toast.loading("Carregando visualização...");
  
  try {
    const { url, error } = await getSignedUrl(STORAGE_BUCKET, filePath);

    if (!url) {
      throw error || new Error("Não foi possível gerar a URL do documento");
    }

    toast.success("Documento carregado", { id: toastId });
    return { url, error: null };
  } catch (error: any) {
    console.error("[fileHandlers] Erro ao obter URL do PDF:", error);
    toast.error(`Erro ao carregar visualização: ${error.message}`, { id: toastId });
    return { url: null, error };
  }
};
