
/**
 * Utilitários para upload de arquivos
 * 
 * Este módulo contém funções para envio de arquivos para o storage
 */

import { supabase } from "@/integrations/supabase/client";
import { logStorage } from './logUtils';

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
    logStorage('upload', `Enviando arquivo para: ${filePath} no bucket: ${bucketName}`);

    // Verificar se o arquivo está presente
    if (!file) {
      logStorage('upload', 'Arquivo ausente', 'error');
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
      logStorage('upload', `Erro ao fazer upload: ${uploadError.message}`, 'error');
      return { success: false, error: uploadError };
    }

    logStorage('upload', 'Upload concluído com sucesso');
    
    // Obter URL pública
    const { data: urlData } = await supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    
    if (!urlData?.publicUrl) {
      logStorage('upload', 'Não foi possível obter a URL pública', 'error');
      return { success: true, error: "Não foi possível obter a URL pública" };
    }
    
    logStorage('upload', `URL pública gerada: ${urlData.publicUrl}`);
    return { success: true, publicUrl: urlData.publicUrl };
  } catch (error) {
    logStorage('upload', `Erro inesperado durante upload: ${error}`, 'error');
    return { success: false, error };
  }
};
