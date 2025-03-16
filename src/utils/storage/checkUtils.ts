
/**
 * Utilitários para verificação de arquivos
 * 
 * Este módulo contém funções para verificar se arquivos existem no storage
 */

import { supabase } from "@/integrations/supabase/client";
import { logStorage } from './logUtils';

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
    logStorage('check', `Verificando existência do arquivo: ${filePath} no bucket: ${bucketName}`);
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(filePath.split('/').slice(0, -1).join('/'));
      
    if (error) {
      logStorage('check', `Erro ao verificar existência do arquivo: ${error.message}`, 'error');
      return false;
    }
    
    const fileName = filePath.split('/').pop();
    const exists = data.some(file => file.name === fileName);
    
    logStorage('check', exists ? 'Arquivo encontrado' : 'Arquivo não encontrado');
    return exists;
  } catch (error) {
    logStorage('check', `Erro ao verificar existência do arquivo: ${error}`, 'error');
    return false;
  }
};
