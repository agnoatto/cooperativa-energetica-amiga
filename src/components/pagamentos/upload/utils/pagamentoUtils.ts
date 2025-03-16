
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
    
    const { error } = await supabase
      .from("pagamentos_usina")
      .update({
        arquivo_conta_energia_nome: arquivoData.nome,
        arquivo_conta_energia_path: arquivoData.path,
        arquivo_conta_energia_tipo: arquivoData.tipo,
        arquivo_conta_energia_tamanho: arquivoData.tamanho,
        atualizado_em: new Date().toISOString() // Adicionar timestamp de atualização
      })
      .eq("id", pagamentoId);

    if (error) {
      console.error("[pagamentoUtils] Erro ao atualizar pagamento:", error);
      return { success: false, error };
    }

    console.log("[pagamentoUtils] Pagamento atualizado com sucesso");
    return { success: true };
  } catch (error) {
    console.error("[pagamentoUtils] Erro ao atualizar pagamento:", error);
    return { success: false, error };
  }
};
