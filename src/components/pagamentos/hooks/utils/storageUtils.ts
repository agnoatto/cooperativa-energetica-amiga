
/**
 * Utilitários para operações de storage relacionadas a pagamentos
 * 
 * Este módulo centraliza as operações de storage como upload, download,
 * remoção e geração de URLs assinadas para arquivos de contas de energia
 */

import { STORAGE_BUCKET, SIGNED_URL_EXPIRY } from "../constants";
import { 
  uploadFile as sharedUploadFile, 
  getSignedUrl as sharedGetSignedUrl,
  downloadFile as sharedDownloadFile,
  removeFile as sharedRemoveFile
} from "@/utils/storageUtils";
import { supabase } from "@/integrations/supabase/client";

// Upload de arquivo para o bucket
export async function uploadFile(filePath: string, file: File) {
  console.log("[storageUtils:pagamentos] Iniciando upload para:", filePath);
  
  try {
    const { success, error } = await sharedUploadFile(STORAGE_BUCKET, filePath, file);

    if (!success) {
      throw error;
    }

    console.log("[storageUtils:pagamentos] Upload finalizado com sucesso");
    return { success: true, error: null };
  } catch (error) {
    console.error("[storageUtils:pagamentos] Erro no processo de upload:", error);
    return { success: false, error };
  }
}

// Atualização dos metadados do arquivo no banco
export async function updateMetadataInDB(pagamentoId: string, metadata: {
  nome: string | null,
  path: string | null,
  tipo: string | null,
  tamanho: number | null
}) {
  console.log("[storageUtils:pagamentos] Atualizando metadados no DB para pagamento:", pagamentoId);
  
  try {
    const { error } = await supabase
      .from('pagamentos_usina')
      .update({
        arquivo_conta_energia_nome: metadata.nome,
        arquivo_conta_energia_path: metadata.path,
        arquivo_conta_energia_tipo: metadata.tipo,
        arquivo_conta_energia_tamanho: metadata.tamanho
      })
      .eq('id', pagamentoId);

    if (error) {
      console.error("[storageUtils:pagamentos] Erro ao atualizar registro:", error);
      throw error;
    }

    console.log("[storageUtils:pagamentos] Metadados atualizados com sucesso");
    return { success: true, error: null };
  } catch (error) {
    console.error("[storageUtils:pagamentos] Erro na atualização de metadados:", error);
    return { success: false, error };
  }
}

// Gerar URL assinada para visualização
export async function getSignedUrl(filePath: string) {
  console.log("[storageUtils:pagamentos] Gerando URL assinada para:", filePath);
  
  try {
    const { url, error } = await sharedGetSignedUrl(STORAGE_BUCKET, filePath, SIGNED_URL_EXPIRY);

    if (!url) {
      throw error || new Error("Erro ao gerar URL assinada");
    }

    console.log("[storageUtils:pagamentos] URL assinada gerada com sucesso");
    return { url, error: null };
  } catch (error) {
    console.error("[storageUtils:pagamentos] Erro ao gerar URL assinada:", error);
    return { url: null, error };
  }
}

// Remover arquivo do storage
export async function removeFile(filePath: string) {
  console.log("[storageUtils:pagamentos] Removendo arquivo:", filePath);
  
  try {
    const { success, error } = await sharedRemoveFile(STORAGE_BUCKET, filePath);

    if (!success) {
      throw error;
    }

    console.log("[storageUtils:pagamentos] Arquivo removido com sucesso");
    return { success: true, error: null };
  } catch (error) {
    console.error("[storageUtils:pagamentos] Erro ao remover arquivo:", error);
    return { success: false, error };
  }
}

// Download de arquivo
export async function downloadFile(filePath: string, fileName: string) {
  console.log("[storageUtils:pagamentos] Baixando arquivo:", filePath);
  
  try {
    const { data, error } = await sharedDownloadFile(STORAGE_BUCKET, filePath);

    if (!data) {
      throw error;
    }

    console.log("[storageUtils:pagamentos] Download concluído, criando URL");
    return { data, error: null };
  } catch (error) {
    console.error("[storageUtils:pagamentos] Erro ao baixar arquivo:", error);
    return { data: null, error };
  }
}
