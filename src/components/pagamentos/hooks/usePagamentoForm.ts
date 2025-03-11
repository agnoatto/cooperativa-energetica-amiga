
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
}

export const usePagamentoForm = () => {
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Salva as alterações no pagamento
   */
  const salvarPagamento = async (dados: PagamentoUpdateData) => {
    setIsSaving(true);
    
    try {
      console.log("[usePagamentoForm] Salvando pagamento:", dados);
      
      // Atualizar o pagamento no banco de dados
      const { data, error } = await supabase
        .from("pagamentos_usina")
        .update({
          geracao_kwh: dados.geracao_kwh,
          tusd_fio_b: dados.tusd_fio_b,
          valor_tusd_fio_b: dados.valor_tusd_fio_b,
          valor_concessionaria: dados.valor_concessionaria,
          valor_total: dados.valor_total,
          data_vencimento_concessionaria: dados.data_vencimento_concessionaria,
          data_emissao: dados.data_emissao,
          data_vencimento: dados.data_vencimento
        })
        .eq("id", dados.id)
        .select()
        .single();
        
      if (error) {
        console.error("[usePagamentoForm] Erro ao atualizar pagamento:", error);
        throw new Error(`Erro ao atualizar pagamento: ${error.message}`);
      }
      
      console.log("[usePagamentoForm] Pagamento atualizado com sucesso:", data);
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
