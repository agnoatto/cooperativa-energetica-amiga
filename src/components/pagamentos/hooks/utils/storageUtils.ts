
/**
 * Utilitários para operações de storage relacionadas a pagamentos
 * 
 * Este módulo centraliza as operações de storage como upload, download,
 * remoção e geração de URLs assinadas para arquivos de contas de energia
 */

import { supabase } from "@/integrations/supabase/client";
import { STORAGE_BUCKET, SIGNED_URL_EXPIRY } from "../constants";

// Upload de arquivo para o bucket
export async function uploadFile(filePath: string, file: File) {
  console.log("[storageUtils] Iniciando upload para:", filePath);
  
  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error("[storageUtils] Erro no upload:", error);
      throw error;
    }

    console.log("[storageUtils] Upload finalizado com sucesso");
    return { success: true, error: null };
  } catch (error) {
    console.error("[storageUtils] Erro no processo de upload:", error);
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
  console.log("[storageUtils] Atualizando metadados no DB para pagamento:", pagamentoId);
  
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
      console.error("[storageUtils] Erro ao atualizar registro:", error);
      throw error;
    }

    console.log("[storageUtils] Metadados atualizados com sucesso");
    return { success: true, error: null };
  } catch (error) {
    console.error("[storageUtils] Erro na atualização de metadados:", error);
    return { success: false, error };
  }
}

// Gerar URL assinada para visualização
export async function getSignedUrl(filePath: string) {
  console.log("[storageUtils] Gerando URL assinada para:", filePath);
  
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(filePath, SIGNED_URL_EXPIRY);

    if (error) {
      console.error("[storageUtils] Erro ao gerar URL assinada:", error);
      throw error;
    }

    console.log("[storageUtils] URL assinada gerada com sucesso");
    return { url: data.signedUrl, error: null };
  } catch (error) {
    console.error("[storageUtils] Erro ao gerar URL assinada:", error);
    return { url: null, error };
  }
}

// Remover arquivo do storage
export async function removeFile(filePath: string) {
  console.log("[storageUtils] Removendo arquivo:", filePath);
  
  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error("[storageUtils] Erro ao remover arquivo:", error);
      throw error;
    }

    console.log("[storageUtils] Arquivo removido com sucesso");
    return { success: true, error: null };
  } catch (error) {
    console.error("[storageUtils] Erro ao remover arquivo:", error);
    return { success: false, error };
  }
}

// Download de arquivo
export async function downloadFile(filePath: string, fileName: string) {
  console.log("[storageUtils] Baixando arquivo:", filePath);
  
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .download(filePath);

    if (error) {
      console.error("[storageUtils] Erro no download:", error);
      throw error;
    }

    console.log("[storageUtils] Download concluído, criando URL");
    return { data, error: null };
  } catch (error) {
    console.error("[storageUtils] Erro ao baixar arquivo:", error);
    return { data: null, error };
  }
}
