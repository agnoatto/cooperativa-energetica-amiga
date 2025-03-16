
/**
 * Utilitários para operações relacionadas aos pagamentos
 * 
 * Este módulo contém funções específicas para atualização de informações
 * de pagamentos no banco de dados
 */

import { supabase } from "@/integrations/supabase/client";

// Atualizar dados de arquivo no pagamento
export const updatePagamentoArquivo = async (
  pagamentoId: string,
  arquivoData: {
    nome: string | null;
    path: string | null;
    tipo: string | null;
    tamanho: number | null;
  }
): Promise<{ success: boolean; error?: any }> => {
  try {
    console.log(`[pagamentoUtils] Atualizando dados do arquivo do pagamento: ${pagamentoId}`, arquivoData);
    
    // Verifica se todos os valores são nulos (arquivo sendo removido)
    const isRemovingFile = 
      arquivoData.nome === null && 
      arquivoData.path === null && 
      arquivoData.tipo === null && 
      arquivoData.tamanho === null;
    
    console.log(`[pagamentoUtils] Operação: ${isRemovingFile ? 'Removendo arquivo' : 'Atualizando arquivo'}`);
    
    // Usar a função RPC para garantir que a atualização seja feita mesmo com as RLS policies
    const { data, error } = await supabase.rpc('atualizar_pagamento_usina', {
      p_id: pagamentoId,
      p_arquivo_conta_energia_nome: arquivoData.nome,
      p_arquivo_conta_energia_path: arquivoData.path,
      p_arquivo_conta_energia_tipo: arquivoData.tipo,
      p_arquivo_conta_energia_tamanho: arquivoData.tamanho,
      // Manter outros campos obrigatórios inalterados
      p_geracao_kwh: 0, // Será preenchido pela função com o valor atual
      p_tusd_fio_b: 0, // Será preenchido pela função com o valor atual
      p_valor_tusd_fio_b: 0, // Será preenchido pela função com o valor atual
      p_valor_concessionaria: 0, // Será preenchido pela função com o valor atual
      p_valor_total: 0, // Será preenchido pela função com o valor atual
      p_data_vencimento_concessionaria: null, // Será preenchido pela função com o valor atual
      p_data_emissao: null, // Será preenchido pela função com o valor atual
      p_data_vencimento: null // Será preenchido pela função com o valor atual
    });

    if (error) {
      console.error("[pagamentoUtils] Erro ao atualizar pagamento via RPC:", error);
      return { success: false, error };
    }

    console.log("[pagamentoUtils] Pagamento atualizado com sucesso via RPC");
    return { success: true };
  } catch (error) {
    console.error("[pagamentoUtils] Erro ao atualizar pagamento:", error);
    return { success: false, error };
  }
};
