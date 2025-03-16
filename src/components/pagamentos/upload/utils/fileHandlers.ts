
/**
 * Utilitários para manipulação de arquivos de contas de energia
 * 
 * Este módulo contém funções para download, preview e remoção de arquivos
 * relacionados às contas de energia de pagamentos de usinas
 */

import { toast } from "sonner";
import { STORAGE_BUCKET } from "../../hooks/constants";
import { downloadFile, getSignedUrl, removeFile } from "@/utils/storage";
import { supabase } from "@/integrations/supabase/client";

// Função para download de arquivo
export const handleDownload = async (filePath: string, fileName: string) => {
  const toastId = toast.loading("Preparando download...");
  
  try {
    const { data, error } = await downloadFile(STORAGE_BUCKET, filePath);

    if (!data) {
      throw error;
    }

    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast.success("Download iniciado", { id: toastId });
    return { success: true, error: null };
  } catch (error: any) {
    console.error("[fileHandlers:pagamentos] Erro ao baixar arquivo:", error);
    toast.error(`Erro ao baixar: ${error.message}`, { id: toastId });
    return { success: false, error };
  }
};

// Função para remover arquivo - simplificada sem restrições
export const handleRemoveFile = async (filePath: string, pagamentoId: string) => {
  const toastId = toast.loading("Removendo arquivo...");
  
  try {
    console.log(`[fileHandlers] Iniciando remoção do arquivo ${filePath} do bucket ${STORAGE_BUCKET} para o pagamento ${pagamentoId}`);
    
    // Atualização direta no banco de dados usando SQL para evitar restrições
    const { error: updateError } = await supabase
      .from('pagamentos_usina')
      .update({
        arquivo_conta_energia_nome: null,
        arquivo_conta_energia_path: null,
        arquivo_conta_energia_tipo: null,
        arquivo_conta_energia_tamanho: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', pagamentoId);

    if (updateError) {
      console.error("[fileHandlers] Erro ao atualizar informações do pagamento:", updateError);
      toast.error(`Erro ao atualizar dados: ${updateError.message}`, { id: toastId });
      return { success: false, error: updateError };
    }

    // Tenta remover o arquivo físico do storage
    try {
      const { success, error: removeError } = await removeFile(STORAGE_BUCKET, filePath);

      if (!success) {
        console.warn("[fileHandlers] Aviso: O arquivo pode não ter sido removido do storage, mas o registro foi atualizado:", removeError);
      }
    } catch (removeError) {
      console.warn("[fileHandlers] Erro ao remover arquivo do storage, mas o registro foi atualizado:", removeError);
      // Não retornamos erro aqui, consideramos sucesso mesmo que a remoção do arquivo falhe
    }

    console.log("[fileHandlers] Arquivo removido com sucesso do registro do pagamento");
    toast.success("Arquivo removido com sucesso", { id: toastId });
    return { success: true, error: null };
  } catch (error: any) {
    console.error("[fileHandlers:pagamentos] Erro ao remover arquivo:", error);
    toast.error(`Erro ao remover: ${error.message}`, { id: toastId });
    return { success: false, error };
  }
};

// Função para gerar preview de arquivo
export const handlePreview = async (filePath: string) => {
  const toastId = toast.loading("Carregando visualização...");
  
  try {
    const { url, error } = await getSignedUrl(STORAGE_BUCKET, filePath);

    if (!url) {
      throw error || new Error("Não foi possível gerar a URL do documento");
    }

    toast.success("Documento carregado", { id: toastId });
    return { url, error: null };
  } catch (error: any) {
    console.error("[fileHandlers:pagamentos] Erro ao obter URL do PDF:", error);
    toast.error(`Erro ao carregar visualização: ${error.message}`, { id: toastId });
    return { url: null, error };
  }
};
