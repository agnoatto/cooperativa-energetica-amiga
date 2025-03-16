/**
 * Utilitários para operações de armazenamento relacionadas a pagamentos
 * 
 * Este módulo contém funções auxiliares para upload, download e gerenciamento
 * de arquivos específicos para o módulo de pagamentos.
 */

import { supabase } from "@/integrations/supabase/client";
import { STORAGE_BUCKET, SIGNED_URL_EXPIRY } from "../constants";

// Fazer upload de um arquivo para o storage
export const uploadFile = async (
  bucketName: string,
  filePath: string,
  file: File
): Promise<{ success: boolean; publicUrl?: string; error?: any }> => {
  try {
    console.log(`[storageUtils:pagamentos] Iniciando upload para ${bucketName}/${filePath}`);
    
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error("[storageUtils:pagamentos] Erro no upload:", error);
      throw error;
    }
    
    // Obter URL pública
    const { data } = await supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    
    console.log("[storageUtils:pagamentos] Upload concluído com sucesso, URL:", data.publicUrl);
    
    return { 
      success: true, 
      publicUrl: data.publicUrl 
    };
  } catch (error: any) {
    console.error("[storageUtils:pagamentos] Erro no upload:", error);
    return { 
      success: false, 
      error 
    };
  }
};

// Gerar URL assinada para um arquivo
export const getSignedUrl = async (
  bucketName: string,
  filePath: string,
  expiresIn: number = SIGNED_URL_EXPIRY
): Promise<{ url: string | null; error?: any }> => {
  try {
    console.log(`[storageUtils:pagamentos] Gerando URL assinada para ${bucketName}/${filePath}`);
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, expiresIn);
    
    if (error) {
      console.error("[storageUtils:pagamentos] Erro ao gerar URL assinada:", error);
      throw error;
    }
    
    console.log("[storageUtils:pagamentos] URL assinada gerada:", data.signedUrl);
    
    return { url: data.signedUrl };
  } catch (error: any) {
    console.error("[storageUtils:pagamentos] Erro ao gerar URL assinada:", error);
    return { url: null, error };
  }
};

// Baixar um arquivo
export const downloadFile = async (
  bucketName: string,
  filePath: string
): Promise<{ data: Blob | null; error?: any }> => {
  try {
    console.log(`[storageUtils:pagamentos] Baixando arquivo ${bucketName}/${filePath}`);
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(filePath);
    
    if (error) {
      console.error("[storageUtils:pagamentos] Erro ao baixar arquivo:", error);
      throw error;
    }
    
    console.log("[storageUtils:pagamentos] Arquivo baixado com sucesso");
    
    return { data };
  } catch (error: any) {
    console.error("[storageUtils:pagamentos] Erro ao baixar arquivo:", error);
    return { data: null, error };
  }
};

// Remover um arquivo
export const removeFile = async (
  bucketName: string,
  filePath: string
): Promise<{ success: boolean; error?: any }> => {
  try {
    console.log(`[storageUtils:pagamentos] Removendo arquivo ${bucketName}/${filePath}`);
    
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
    
    if (error) {
      console.error("[storageUtils:pagamentos] Erro ao remover arquivo:", error);
      throw error;
    }
    
    console.log("[storageUtils:pagamentos] Arquivo removido com sucesso");
    
    return { success: true };
  } catch (error: any) {
    console.error("[storageUtils:pagamentos] Erro ao remover arquivo:", error);
    return { success: false, error };
  }
};
