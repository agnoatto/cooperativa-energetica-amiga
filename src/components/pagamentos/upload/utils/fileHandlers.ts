
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

// Função para remover arquivo
export const handleRemoveFile = async (filePath: string, pagamentoId: string) => {
  const toastId = toast.loading("Removendo arquivo...");
  
  try {
    console.log(`[fileHandlers] Removendo arquivo ${filePath} do bucket ${STORAGE_BUCKET} para o pagamento ${pagamentoId}`);
    
    // Primeiro buscar os dados atuais do pagamento
    const { data: pagamento, error: fetchError } = await supabase
      .from('pagamentos_usina')
      .select('*')
      .eq('id', pagamentoId)
      .single();
    
    if (fetchError || !pagamento) {
      console.error("[fileHandlers] Erro ao buscar dados do pagamento:", fetchError);
      toast.error(`Erro ao buscar dados do pagamento: ${fetchError?.message || "Pagamento não encontrado"}`, { id: toastId });
      return { success: false, error: fetchError };
    }
    
    // Agora atualizamos o registro no banco de dados com todos os campos obrigatórios
    const { error: updateError } = await supabase.rpc('atualizar_pagamento_usina', {
      p_id: pagamentoId,
      p_geracao_kwh: pagamento.geracao_kwh,
      p_tusd_fio_b: pagamento.tusd_fio_b,
      p_valor_tusd_fio_b: pagamento.valor_tusd_fio_b,
      p_valor_concessionaria: pagamento.valor_concessionaria,
      p_valor_total: pagamento.valor_total,
      p_data_vencimento_concessionaria: pagamento.data_vencimento_concessionaria,
      p_data_emissao: pagamento.data_emissao,
      p_data_vencimento: pagamento.data_vencimento,
      // Definimos os campos de arquivo como null
      p_arquivo_conta_energia_nome: null,
      p_arquivo_conta_energia_path: null,
      p_arquivo_conta_energia_tipo: null,
      p_arquivo_conta_energia_tamanho: null
    });

    if (updateError) {
      console.error("[fileHandlers] Erro ao atualizar informações do pagamento:", updateError);
      toast.error(`Erro ao atualizar dados: ${updateError?.message || "Erro desconhecido"}`, { id: toastId });
      return { success: false, error: updateError };
    }

    // Depois tentamos remover o arquivo do storage, mas não impedimos o sucesso da operação se falhar
    try {
      const { success, error: removeError } = await removeFile(STORAGE_BUCKET, filePath);

      if (!success) {
        console.warn("[fileHandlers] Aviso: O arquivo pode não ter sido removido do storage, mas o registro foi atualizado:", removeError);
      }
    } catch (removeError) {
      console.warn("[fileHandlers] Erro ao remover arquivo do storage, mas continuando:", removeError);
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
