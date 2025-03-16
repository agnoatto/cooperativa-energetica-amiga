
/**
 * Utilitários para remoção de arquivos
 * 
 * Este módulo contém funções para remover arquivos do storage
 */

import { supabase } from "@/integrations/supabase/client";
import { logStorage } from './logUtils';

/**
 * Remove um arquivo do storage
 * @param bucketName Nome do bucket onde o arquivo está armazenado
 * @param filePath Caminho do arquivo no bucket
 * @returns Resultado da operação ou erro
 */
export const removeFile = async (
  bucketName: string, 
  filePath: string
): Promise<{ success: boolean; error?: any }> => {
  try {
    logStorage('remove', `Removendo arquivo: ${filePath} do bucket: ${bucketName}`);
    
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      logStorage('remove', `Erro ao remover arquivo: ${error.message}`, 'error');
      return { success: false, error };
    }

    logStorage('remove', 'Arquivo removido com sucesso');
    return { success: true };
  } catch (error) {
    logStorage('remove', `Erro ao remover arquivo: ${error}`, 'error');
    return { success: false, error };
  }
};
