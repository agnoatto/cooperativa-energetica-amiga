
/**
 * Hook para atualização de status de lançamentos financeiros
 * 
 * Gerencia a atualização de status de contas a pagar e receber,
 * mantendo o histórico de mudanças e permitindo registrar valores de pagamento.
 */
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LancamentoFinanceiro, StatusLancamento } from "@/types/financeiro";
import { toast } from "sonner";

interface UpdateLancamentoOptions {
  valorPago?: number;
  valorJuros?: number; 
  valorDesconto?: number;
  observacao?: string;
}

export function useUpdateLancamentoStatus() {
  const [isUpdating, setIsUpdating] = useState(false);

  // Função para atualizar o status de um lançamento
  const updateLancamentoStatus = async (
    lancamento: LancamentoFinanceiro,
    newStatus: StatusLancamento,
    options?: UpdateLancamentoOptions
  ) => {
    try {
      setIsUpdating(true);

      const { valorPago, valorJuros = 0, valorDesconto = 0, observacao } = options || {};

      // Preparar o histórico de status para a atualização
      const novoHistorico = {
        data: new Date().toISOString(),
        status_anterior: lancamento.status,
        novo_status: newStatus,
        ...(valorPago !== undefined && { valor_pago: valorPago }),
        ...(valorJuros > 0 && { valor_juros: valorJuros }),
        ...(valorDesconto > 0 && { valor_desconto: valorDesconto })
      };
      
      // Configurar a data de pagamento
      let dataPagamento: string | null = lancamento.data_pagamento;
      
      // Se o novo status é pago, definir a data de pagamento como hoje
      if (newStatus === 'pago') {
        dataPagamento = new Date().toISOString();
      } 
      // Se o status anterior era pago mas o novo não é, remover a data de pagamento
      else if (lancamento.status === 'pago') {
        dataPagamento = null;
      }

      // Criar o histórico atualizado
      const historicoAtualizado = [
        ...(lancamento.historico_status || []),
        novoHistorico
      ];

      // Atualizar o lançamento no banco
      const updateData: any = {
        status: newStatus,
        data_pagamento: dataPagamento,
        historico_status: historicoAtualizado
      };

      // Adicionar campos opcionais se fornecidos
      if (newStatus === 'pago') {
        if (valorPago !== undefined) {
          updateData.valor_pago = valorPago;
        } else {
          updateData.valor_pago = lancamento.valor;
        }

        if (valorJuros !== undefined) {
          updateData.valor_juros = valorJuros;
        }

        if (valorDesconto !== undefined) {
          updateData.valor_desconto = valorDesconto;
        }
      }

      if (observacao) {
        updateData.observacao = observacao;
      }

      // Atualizar o lançamento no banco
      const { error } = await supabase
        .from('lancamentos_financeiros')
        .update(updateData)
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

  // Função mais completa para registrar pagamentos com valores personalizados
  const registrarPagamento = async (
    lancamento: LancamentoFinanceiro,
    valorPago: number,
    valorJuros: number = 0,
    valorDesconto: number = 0,
    dataPagamento: string = new Date().toISOString(),
    observacao?: string
  ) => {
    try {
      setIsUpdating(true);

      console.log("Registrando pagamento:", {
        lancamento_id: lancamento.id,
        valor_pago: valorPago,
        valor_juros: valorJuros,
        valor_desconto: valorDesconto,
        data_pagamento: dataPagamento,
        observacao
      });

      // Usar a função RPC criada no banco de dados
      const { data, error } = await supabase.rpc('registrar_pagamento_lancamento', {
        p_lancamento_id: lancamento.id,
        p_valor_pago: valorPago,
        p_valor_juros: valorJuros,
        p_valor_desconto: valorDesconto,
        p_data_pagamento: dataPagamento,
        p_observacao: observacao
      });

      if (error) {
        console.error("Erro ao registrar pagamento:", error);
        toast.error(`Erro ao registrar pagamento: ${error.message}`);
        return false;
      }

      const valorLiquido = valorPago - valorJuros + valorDesconto;
      toast.success(`Pagamento registrado com sucesso: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorLiquido)}`);
      console.log("Resultado do pagamento:", data);
      return true;
    } catch (error) {
      console.error("Erro ao registrar pagamento:", error);
      toast.error("Erro ao registrar pagamento");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateLancamentoStatus,
    registrarPagamento,
    isUpdating
  };
}
