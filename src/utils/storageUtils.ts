
/**
 * Utilitários compartilhados para operações de armazenamento
 * 
 * Este módulo centraliza funções de armazenamento comuns para upload, download,
 * remoção e geração de URLs assinadas para arquivos em diversos módulos do sistema
 */

import { supabase } from "@/integrations/supabase/client";

/**
 * Realiza o upload de um arquivo para o bucket especificado
 * @param bucketName Nome do bucket para o upload
 * @param filePath Caminho onde o arquivo será armazenado
 * @param file Arquivo a ser enviado
 * @returns Objeto contendo sucesso da operação e possível erro
 */
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
        cacheControl: '3600',
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

/**
 * Cria uma URL assinada para visualização de um arquivo
 * @param bucketName Nome do bucket onde o arquivo está armazenado
 * @param filePath Caminho do arquivo no bucket
 * @param expiresIn Tempo de expiração da URL em segundos (padrão: 3600)
 * @returns URL assinada ou erro
 */
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

/**
 * Baixa um arquivo do storage
 * @param bucketName Nome do bucket onde o arquivo está armazenado
 * @param filePath Caminho do arquivo no bucket
 * @returns Blob do arquivo ou erro
 */
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
      console.error("[storageUtils] Erro no download:", error);
      return { data: null, error };
    }

    return { data };
  } catch (error) {
    console.error("[storageUtils] Erro ao baixar arquivo:", error);
    return { data: null, error };
  }
};

/**
 * Remove um arquivo do storage
 * @param bucketName Nome do bucket onde o arquivo está armazenado
 * @param filePath Caminho do arquivo no bucket
 * @returns Sucesso da operação ou erro
 */
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
