
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
 * @returns Objeto contendo sucesso da operação, URL pública e possível erro
 */
export const uploadFile = async (
  bucketName: string, 
  filePath: string, 
  file: File
): Promise<{ success: boolean; publicUrl?: string; error?: any }> => {
  try {
    console.log(`[storageUtils] Enviando arquivo para: ${filePath} no bucket: ${bucketName}`);

    // Verificar se o arquivo está presente
    if (!file) {
      console.error("[storageUtils] Arquivo ausente");
      return { success: false, error: "Arquivo ausente" };
    }

    // Fazer o upload do arquivo
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        upsert: true,
        cacheControl: '3600',
        contentType: file.type,
      });

    if (uploadError) {
      console.error("[storageUtils] Erro ao fazer upload:", uploadError);
      return { success: false, error: uploadError };
    }

    console.log("[storageUtils] Upload concluído com sucesso");
    
    // Obter URL pública
    const { data: urlData } = await supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    
    if (!urlData?.publicUrl) {
      console.error("[storageUtils] Não foi possível obter a URL pública");
      return { success: true, error: "Não foi possível obter a URL pública" };
    }
    
    console.log("[storageUtils] URL pública gerada:", urlData.publicUrl);
    return { success: true, publicUrl: urlData.publicUrl };
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
    
    if (!filePath) {
      console.error("[storageUtils] Caminho do arquivo inválido");
      return { success: false, error: "Caminho do arquivo inválido" };
    }
    
    // Verificar se temos uma URL completa
    if (filePath.startsWith('http')) {
      console.log("[storageUtils] Arquivo com URL completa. Extraindo caminho relativo.");
      
      // Tentamos extrair o caminho relativo
      try {
        // Especificamos o regex para capturar corretamente a URL
        const regex = new RegExp(`/storage/v1/object/public/${bucketName}/(.+)`);
        const match = filePath.match(regex);
        
        if (match && match[1]) {
          filePath = match[1];
          console.log(`[storageUtils] Caminho extraído: ${filePath}`);
        } else {
          console.error("[storageUtils] Não foi possível extrair o caminho do arquivo");
          return { success: false, error: "Formato de URL inválido" };
        }
      } catch (error) {
        console.error("[storageUtils] Erro ao processar URL:", error);
        return { success: false, error };
      }
    }
    
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

/**
 * Verifica se um arquivo existe no bucket
 * @param bucketName Nome do bucket
 * @param filePath Caminho do arquivo
 * @returns Boolean indicando se o arquivo existe
 */
export const checkFileExists = async (
  bucketName: string,
  filePath: string
): Promise<boolean> => {
  try {
    console.log(`[storageUtils] Verificando existência do arquivo: ${filePath} no bucket: ${bucketName}`);
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(filePath.split('/').slice(0, -1).join('/'));
      
    if (error) {
      console.error("[storageUtils] Erro ao verificar existência do arquivo:", error);
      return false;
    }
    
    const fileName = filePath.split('/').pop();
    return data.some(file => file.name === fileName);
  } catch (error) {
    console.error("[storageUtils] Erro ao verificar existência do arquivo:", error);
    return false;
  }
};
