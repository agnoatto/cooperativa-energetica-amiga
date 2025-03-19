
/**
 * Hook para atualização de status de lançamentos financeiros
 * 
 * Gerencia a atualização de status de contas a pagar e receber,
 * mantendo o histórico de mudanças.
 */
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LancamentoFinanceiro, StatusLancamento } from "@/types/financeiro";
import { toast } from "sonner";

export function useUpdateLancamentoStatus() {
  const [isUpdating, setIsUpdating] = useState(false);

  // Função para atualizar o status de um lançamento
  const updateLancamentoStatus = async (
    lancamento: LancamentoFinanceiro,
    newStatus: StatusLancamento
  ) => {
    try {
      setIsUpdating(true);

      // Preparar o histórico de status para a atualização
      const novoHistorico = {
        data: new Date().toISOString(),
        status_anterior: lancamento.status,
        novo_status: newStatus
      };
      
      // Se está sendo marcado como pago, definir a data de pagamento como hoje
      const dataPagamento = newStatus === 'pago' ? new Date().toISOString() : 
                           newStatus !== 'pago' && lancamento.status === 'pago' ? null : 
                           lancamento.data_pagamento;

      // Atualizar o lançamento no banco
      const { error } = await supabase
        .from('lancamentos_financeiros')
        .update({
          status: newStatus,
          data_pagamento: dataPagamento,
          historico_status: [...(lancamento.historico_status || []), novoHistorico]
        })
        .eq('id', lancamento.id);

      if (error) {
        console.error("Erro ao atualizar status:", error);
        toast.error(`Erro ao atualizar status: ${error.message}`);
        return false;
      }

      toast.success(`Status atualizado com sucesso para ${newStatus}`);
      return true;
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateLancamentoStatus,
    isUpdating
  };
}
