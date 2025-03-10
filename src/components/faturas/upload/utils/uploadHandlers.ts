
/**
 * Utilitários para operações de upload de arquivos de faturas
 * Este módulo contém funções para processamento de upload de arquivos
 * e atualização dos metadados no banco de dados
 */

import { toast } from "sonner";
import { STORAGE_BUCKET } from "../constants";
import { validateFile } from "./fileValidation";
import { uploadFile } from "./storageUtils";
import { updateFaturaArquivo } from "./faturaUtils";

// Interface para callbacks de notificação
export interface NotifyCallbacks {
  onFileChange?: (nome: string | null, path: string | null, tipo: string | null, tamanho: number | null) => void;
  onSuccess?: () => void;
  refetchFaturas?: () => void;
}

// Notifica as mudanças para os callbacks registrados
export const notifyChanges = (
  nome: string | null, 
  path: string | null, 
  tipo: string | null, 
  tamanho: number | null,
  callbacks?: NotifyCallbacks
) => {
  console.log("[uploadHandlers] Notificando mudanças:", { nome, path, tipo, tamanho });
  
  if (callbacks?.onFileChange) {
    console.log("[uploadHandlers] Chamando onFileChange");
    callbacks.onFileChange(nome, path, tipo, tamanho);
  }
  
  if (callbacks?.onSuccess) {
    console.log("[uploadHandlers] Chamando onSuccess");
    callbacks.onSuccess();
  }
  
  if (callbacks?.refetchFaturas) {
    console.log("[uploadHandlers] Chamando refetchFaturas");
    callbacks.refetchFaturas();
  }
};

// Processa o upload de arquivos
export const processFileUpload = async (
  files: File[], 
  faturaId: string,
  callbacks?: NotifyCallbacks
) => {
  if (files.length === 0) return { success: false, error: new Error("Nenhum arquivo selecionado") };

  const file = files[0];
  
  if (!validateFile(file)) {
    return { success: false, error: new Error("Arquivo inválido") };
  }

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
    
    notifyChanges(file.name, filePath, file.type, file.size, callbacks);
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error("[uploadHandlers] Erro ao processar upload:", error);
    toast.error(`Erro ao fazer upload: ${error.message}`, { id: toastId });
    return { success: false, error };
  }
};
