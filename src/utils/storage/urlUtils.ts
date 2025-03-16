
/**
 * Utilitários para geração de URLs
 * 
 * Este módulo contém funções para criação de URLs assinadas para
 * visualização temporária de arquivos no storage
 */

import { supabase } from "@/integrations/supabase/client";
import { logStorage } from './logUtils';

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
    logStorage('url', `Gerando URL assinada para: ${filePath} no bucket: ${bucketName}`);
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      logStorage('url', `Erro ao criar URL assinada: ${error.message}`, 'error');
      return { url: null, error };
    }

    if (!data?.signedUrl) {
      logStorage('url', 'Não foi possível gerar a URL do documento', 'error');
      return { url: null, error: new Error("Não foi possível gerar a URL do documento") };
    }

    logStorage('url', 'URL gerada com sucesso');
    return { url: data.signedUrl };
  } catch (error) {
    logStorage('url', `Erro ao gerar URL assinada: ${error}`, 'error');
    return { url: null, error };
  }
};
