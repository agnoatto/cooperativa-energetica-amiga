
/**
 * Hook para gerenciar a edição e salvamento de pagamentos de usinas
 * 
 * Este hook fornece funcionalidades para salvar mudanças nos dados
 * de pagamentos, incluindo comunicação com o banco de dados Supabase
 * e tratamento de erros.
 */
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PagamentoUpdateData {
  id: string;
  geracao_kwh: number;
  tusd_fio_b: number;
  valor_tusd_fio_b: number;
  valor_concessionaria: number;
  valor_total: number;
  data_vencimento_concessionaria: string | null;
  data_emissao: string | null;
  data_vencimento: string | null;
  arquivo_conta_energia_nome?: string | null;
  arquivo_conta_energia_path?: string | null;
  arquivo_conta_energia_tipo?: string | null;
  arquivo_conta_energia_tamanho?: number | null;
}

export const usePagamentoForm = () => {
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Salva as alterações no pagamento usando uma função RPC para evitar
   * problemas de recursão infinita nas políticas de segurança
   */
  const salvarPagamento = async (dados: PagamentoUpdateData) => {
    setIsSaving(true);
    
    try {
      console.log("[usePagamentoForm] Iniciando salvamento do pagamento:", dados);
      
      // Verificar a estrutura da função RPC no banco de dados
      // e garantir que os parâmetros estejam corretos
      const { data, error } = await supabase.rpc('atualizar_pagamento_usina', {
        p_id: dados.id,
        p_geracao_kwh: dados.geracao_kwh,
        p_tusd_fio_b: dados.tusd_fio_b,
        p_valor_tusd_fio_b: dados.valor_tusd_fio_b,
        p_valor_concessionaria: dados.valor_concessionaria,
        p_valor_total: dados.valor_total,
        p_data_vencimento_concessionaria: dados.data_vencimento_concessionaria,
        p_data_emissao: dados.data_emissao,
        p_data_vencimento: dados.data_vencimento,
        p_arquivo_conta_energia_nome: dados.arquivo_conta_energia_nome,
        p_arquivo_conta_energia_path: dados.arquivo_conta_energia_path,
        p_arquivo_conta_energia_tipo: dados.arquivo_conta_energia_tipo,
        p_arquivo_conta_energia_tamanho: dados.arquivo_conta_energia_tamanho
      });
        
      if (error) {
        console.error("[usePagamentoForm] Erro ao atualizar pagamento via RPC:", error);
        throw new Error(`Erro ao atualizar pagamento: ${error.message}`);
      }
      
      console.log("[usePagamentoForm] Pagamento atualizado com sucesso via RPC:", data);
      return data;
    } catch (error: any) {
      console.error("[usePagamentoForm] Erro ao salvar pagamento:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    salvarPagamento,
    isSaving
  };
};
