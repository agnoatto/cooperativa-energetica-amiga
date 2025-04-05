
/**
 * Hook para atualizar status de lançamentos financeiros
 */
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Tipos necessários
export type StatusLancamento = 'pendente' | 'pago' | 'cancelado' | 'atrasado';

export interface HistoricoStatusEntry {
  data: string;
  status_anterior: StatusLancamento;
  novo_status: StatusLancamento;
  valor_pago?: number;
  valor_juros?: number;
  valor_desconto?: number;
}

export interface Lancamento {
  id: string;
  status: StatusLancamento;
  valor: number;
  data_vencimento: string;
  historico_status: HistoricoStatusEntry[];
  [key: string]: any;
}

export function useUpdateLancamentoStatus() {
  const [isUpdating, setIsUpdating] = useState(false);

  const atualizarStatus = async (
    lancamento: Lancamento, 
    novoStatus: StatusLancamento,
    observacao?: string
  ) => {
    setIsUpdating(true);

    try {
      // Cria um novo item no histórico de status
      const statusAnterior = lancamento.status;
      const novaEntradaHistorico: HistoricoStatusEntry = {
        data: new Date().toISOString(),
        status_anterior: statusAnterior,
        novo_status: novoStatus,
      };

      // Adiciona à lista de histórico existente
      const historico = [...(lancamento.historico_status || []), novaEntradaHistorico];

      // Converte para um formato que o Supabase aceita (JSON)
      const historicoJSON = JSON.stringify(historico);

      // Atualiza o lançamento no banco de dados
      const { error } = await supabase
        .from('lancamentos')
        .update({
          status: novoStatus,
          updated_at: new Date().toISOString(),
          observacao: observacao || lancamento.observacao,
          historico_status: historicoJSON,
        })
        .eq('id', lancamento.id);

      if (error) throw error;

      toast.success(`Status atualizado para ${novoStatus}`);
      return true;
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Falha ao atualizar status");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const registrarPagamento = async (
    lancamento: Lancamento,
    valorPago: number,
    dataRecebimento: string,
    valorJuros = 0,
    valorDesconto = 0,
    observacao?: string
  ) => {
    setIsUpdating(true);

    try {
      // Cria um novo item no histórico de status
      const novaEntradaHistorico = {
        data: dataRecebimento,
        status_anterior: lancamento.status,
        novo_status: "pago" as StatusLancamento,
        valor_pago: valorPago,
        valor_juros: valorJuros,
        valor_desconto: valorDesconto
      };

      // Adiciona à lista de histórico existente
      const historicoAtual: HistoricoStatusEntry[] = lancamento.historico_status || [];
      const historico = [...historicoAtual, novaEntradaHistorico];
      
      // Converte para JSON para salvar no Supabase
      const historicoJSON = JSON.stringify(historico);

      // Atualiza o lançamento
      const { error } = await supabase
        .from('lancamentos')
        .update({
          status: "pago",
          data_recebimento: dataRecebimento,
          valor_pago: valorPago,
          valor_juros: valorJuros,
          valor_desconto: valorDesconto,
          observacao_pagamento: observacao,
          historico_status: historicoJSON,
          updated_at: new Date().toISOString()
        })
        .eq('id', lancamento.id);

      if (error) throw error;

      toast.success("Pagamento registrado com sucesso");
      return true;
    } catch (error) {
      console.error("Erro ao registrar pagamento:", error);
      toast.error("Falha ao registrar pagamento");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    atualizarStatus,
    registrarPagamento,
    isUpdating
  };
}
