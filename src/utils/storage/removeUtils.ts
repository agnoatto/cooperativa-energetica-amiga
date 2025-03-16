
/**
 * Utilitários para remoção de arquivos
 * 
 * Este módulo contém funções para excluir arquivos do storage
 */

import { supabase } from "@/integrations/supabase/client";
import { logStorage } from './logUtils';

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
    logStorage('remove', `Removendo arquivo: ${filePath} do bucket: ${bucketName}`);
    
    if (!filePath) {
      logStorage('remove', 'Caminho do arquivo inválido', 'error');
      return { success: false, error: "Caminho do arquivo inválido" };
    }
    
    // Verificar se temos uma URL completa
    if (filePath.startsWith('http')) {
      logStorage('remove', 'Arquivo com URL completa. Extraindo caminho relativo.');
      
      // Tentamos extrair o caminho relativo
      try {
        // Especificamos o regex para capturar corretamente a URL
        const regex = new RegExp(`/storage/v1/object/public/${bucketName}/(.+)`);
        const match = filePath.match(regex);
        
        if (match && match[1]) {
          filePath = match[1];
          logStorage('remove', `Caminho extraído: ${filePath}`);
        } else {
          logStorage('remove', 'Não foi possível extrair o caminho do arquivo', 'error');
          return { success: false, error: "Formato de URL inválido" };
        }
      } catch (error) {
        logStorage('remove', `Erro ao processar URL: ${error}`, 'error');
        return { success: false, error };
      }
    }
    
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
