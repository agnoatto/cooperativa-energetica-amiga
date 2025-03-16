
/**
 * Utilitários para download de arquivos
 * 
 * Este módulo contém funções para baixar arquivos do storage
 */

import { supabase } from "@/integrations/supabase/client";
import { logStorage } from './logUtils';

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
    logStorage('download', `Baixando arquivo: ${filePath} do bucket: ${bucketName}`);
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(filePath);

    if (error) {
      logStorage('download', `Erro no download: ${error.message}`, 'error');
      return { data: null, error };
    }

    logStorage('download', 'Arquivo baixado com sucesso');
    return { data };
  } catch (error) {
    logStorage('download', `Erro ao baixar arquivo: ${error}`, 'error');
    return { data: null, error };
  }
};
