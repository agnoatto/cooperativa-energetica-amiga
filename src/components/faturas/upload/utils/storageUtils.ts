
/**
 * Utilitários para operações com storage
 * 
 * Este módulo contém funções para interação com o storage do Supabase,
 * incluindo upload, download e exclusão de arquivos.
 */
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { STORAGE_BUCKET } from "../constants";

// Upload de arquivo para o storage
export const uploadFileToStorage = async (
  filePath: string,
  file: File
): Promise<{ success: boolean; error?: any }> => {
  try {
    console.log(`[storageUtils] Enviando arquivo para: ${filePath} no bucket: ${STORAGE_BUCKET}`);
    
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        upsert: true,
        cacheControl: '3600',
        contentType: file.type,
      });

    if (error) {
      console.error("[storageUtils] Erro ao fazer upload:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("[storageUtils] Erro inesperado durante upload:", error);
    return { success: false, error };
  }
};

// Atualizar metadados do arquivo na tabela de faturas
export const updateFaturaFileMetadata = async (
  faturaId: string,
  metadata: {
    nome: string | null;
    path: string | null;
    tipo: string | null;
    tamanho: number | null;
  }
): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase
      .from("faturas")
      .update({
        arquivo_concessionaria_nome: metadata.nome,
        arquivo_concessionaria_path: metadata.path,
        arquivo_concessionaria_tipo: metadata.tipo,
        arquivo_concessionaria_tamanho: metadata.tamanho
      })
      .eq("id", faturaId);

    if (error) {
      console.error("[storageUtils] Erro ao atualizar metadados:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("[storageUtils] Erro inesperado ao atualizar metadados:", error);
    return { success: false, error };
  }
};

// Obter arquivo do storage
export const getFileFromStorage = async (
  filePath: string
): Promise<{ success: boolean; url?: string; error?: any }> => {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(filePath, 3600);

    if (error) {
      console.error("[storageUtils] Erro ao obter URL assinada:", error);
      return { success: false, error };
    }

    return { success: true, url: data.signedUrl };
  } catch (error) {
    console.error("[storageUtils] Erro inesperado ao obter URL assinada:", error);
    return { success: false, error };
  }
};

// Remover arquivo do storage
export const removeFileFromStorage = async (
  filePath: string
): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error("[storageUtils] Erro ao remover arquivo:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("[storageUtils] Erro inesperado ao remover arquivo:", error);
    return { success: false, error };
  }
};
