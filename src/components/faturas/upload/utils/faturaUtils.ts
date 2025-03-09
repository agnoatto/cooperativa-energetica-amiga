
/**
 * Utilitários para operações relacionadas às faturas
 * Este módulo contém funções específicas para atualização de informações
 * de faturas no banco de dados
 */

import { supabase } from "@/integrations/supabase/client";

// Atualizar dados de arquivo na fatura
export const updateFaturaArquivo = async (
  faturaId: string,
  arquivoData: {
    nome: string | null;
    path: string | null;
    tipo: string | null;
    tamanho: number | null;
  }
): Promise<{ success: boolean; error?: any }> => {
  try {
    console.log(`[faturaUtils] Atualizando dados do arquivo da fatura: ${faturaId}`);
    
    const { error } = await supabase
      .from("faturas")
      .update({
        arquivo_concessionaria_nome: arquivoData.nome,
        arquivo_concessionaria_path: arquivoData.path,
        arquivo_concessionaria_tipo: arquivoData.tipo,
        arquivo_concessionaria_tamanho: arquivoData.tamanho,
      })
      .eq("id", faturaId);

    if (error) {
      console.error("[faturaUtils] Erro ao atualizar fatura:", error);
      return { success: false, error };
    }

    console.log("[faturaUtils] Fatura atualizada com sucesso");
    return { success: true };
  } catch (error) {
    console.error("[faturaUtils] Erro ao atualizar fatura:", error);
    return { success: false, error };
  }
};
