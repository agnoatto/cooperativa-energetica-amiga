
/**
 * Utilitários para operações de armazenamento
 * Este módulo contém funções para upload, download e gerenciamento
 * de arquivos no storage do Supabase
 */

import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Fazer upload de arquivo para o storage
export const uploadFile = async (
  bucketName: string, 
  filePath: string, 
  file: File
): Promise<{ success: boolean; error?: any }> => {
  try {
    console.log(`[storageUtils] Enviando arquivo para: ${filePath} no bucket: ${bucketName}`);

    const { error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (error) {
      console.error("[storageUtils] Erro ao fazer upload:", error);
      return { success: false, error };
    }

    console.log("[storageUtils] Upload concluído com sucesso");
    return { success: true };
  } catch (error) {
    console.error("[storageUtils] Erro inesperado durante upload:", error);
    return { success: false, error };
  }
};

// Criar URL assinada para visualização
export const getSignedUrl = async (
  bucketName: string, 
  filePath: string, 
  expiresIn: number = 3600
): Promise<{ url: string | null; error?: any }> => {
  try {
    console.log(`[storageUtils] Gerando URL assinada para: ${filePath} no bucket: ${bucketName}`);
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      console.error("[storageUtils] Erro ao criar URL assinada:", error);
      return { url: null, error };
    }

    if (!data?.signedUrl) {
      return { url: null, error: new Error("Não foi possível gerar a URL do documento") };
    }

    console.log("[storageUtils] URL gerada com sucesso");
    return { url: data.signedUrl };
  } catch (error) {
    console.error("[storageUtils] Erro ao gerar URL assinada:", error);
    return { url: null, error };
  }
};

// Baixar arquivo
export const downloadFile = async (
  bucketName: string, 
  filePath: string
): Promise<{ data: Blob | null; error?: any }> => {
  try {
    console.log(`[storageUtils] Baixando arquivo: ${filePath} do bucket: ${bucketName}`);
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(filePath);

    if (error) {
      console.error("[storageUtils] Erro ao baixar arquivo:", error);
      return { data: null, error };
    }

    return { data };
  } catch (error) {
    console.error("[storageUtils] Erro ao baixar arquivo:", error);
    return { data: null, error };
  }
};

// Remover arquivo
export const removeFile = async (
  bucketName: string, 
  filePath: string
): Promise<{ success: boolean; error?: any }> => {
  try {
    console.log(`[storageUtils] Removendo arquivo: ${filePath} do bucket: ${bucketName}`);
    
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      console.error("[storageUtils] Erro ao remover arquivo:", error);
      return { success: false, error };
    }

    console.log("[storageUtils] Arquivo removido com sucesso");
    return { success: true };
  } catch (error) {
    console.error("[storageUtils] Erro ao remover arquivo:", error);
    return { success: false, error };
  }
};
