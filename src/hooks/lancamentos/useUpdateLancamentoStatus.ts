
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
  contaBancariaId?: string;
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

      const { valorPago, valorJuros = 0, valorDesconto = 0, contaBancariaId, observacao } = options || {};

      // Preparar o histórico de status para a atualização - convertendo para objeto simples para ser compatível com Json
      const novoHistorico = {
        data: new Date().toISOString(),
        status_anterior: lancamento.status,
        novo_status: newStatus,
        ...(valorPago !== undefined && { valor_pago: valorPago }),
        ...(valorJuros > 0 && { valor_juros: valorJuros }),
        ...(valorDesconto > 0 && { valor_desconto: valorDesconto }),
        // Adicionamos comentário no histórico, não na observação principal
        observacao: `Status alterado de ${lancamento.status} para ${newStatus}`
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

      // Criar o histórico atualizado como um array de objetos simples
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

        if (contaBancariaId) {
          updateData.conta_bancaria_id = contaBancariaId;
        }
      }

      // Só atualizar a observação principal se uma nova foi explicitamente fornecida
      if (observacao) {
        updateData.observacao = observacao;
      }
      // Não modificar a observação existente se nenhuma nova for fornecida

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

      // Se o pagamento foi registrado e temos uma conta bancária selecionada, atualizar saldo
      if (newStatus === 'pago' && contaBancariaId) {
        // Se for uma despesa, diminuir o saldo da conta
        // Se for uma receita, aumentar o saldo da conta
        const valorMovimentacao = lancamento.tipo === 'despesa' ? 
          -(valorPago || lancamento.valor) : 
          (valorPago || lancamento.valor);
          
        await atualizarSaldoConta(contaBancariaId, valorMovimentacao);
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
    observacao?: string,
    contaBancariaId?: string
  ) => {
    try {
      setIsUpdating(true);

      console.log("Registrando pagamento:", {
        lancamento_id: lancamento.id,
        valor_pago: valorPago,
        valor_juros: valorJuros,
        valor_desconto: valorDesconto,
        data_pagamento: dataPagamento,
        conta_bancaria_id: contaBancariaId,
        observacao
      });

      // Criar diretamente o objeto de histórico como objeto simples
      const novoHistoricoItem = {
        data: new Date().toISOString(),
        status_anterior: lancamento.status,
        novo_status: 'pago',
        valor_pago: valorPago,
        valor_juros: valorJuros,
        valor_desconto: valorDesconto
      };

      // Criar o histórico atualizado manualmente como array de objetos simples
      const historicoAtualizado = [...(lancamento.historico_status || []), novoHistoricoItem];

      // Atualizar o lançamento manualmente
      const { error: updateError } = await supabase
        .from('lancamentos_financeiros')
        .update({
          status: 'pago',
          valor_pago: valorPago,
          valor_juros: valorJuros,
          valor_desconto: valorDesconto,
          data_pagamento: dataPagamento,
          observacao: observacao || lancamento.observacao,
          conta_bancaria_id: contaBancariaId,
          historico_status: historicoAtualizado
        })
        .eq('id', lancamento.id);

      if (updateError) throw updateError;

      // Se o pagamento foi registrado e temos uma conta bancária selecionada, atualizar saldo
      if (contaBancariaId) {
        const valorMovimentacao = lancamento.tipo === 'despesa' ? -valorPago : valorPago;
        await atualizarSaldoConta(contaBancariaId, valorMovimentacao);
      }

      const valorLiquido = valorPago - valorJuros + valorDesconto;
      toast.success(`Pagamento registrado com sucesso: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorLiquido)}`);
      return true;
    } catch (error) {
      console.error("Erro ao registrar pagamento:", error);
      toast.error("Erro ao registrar pagamento");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Função para atualizar o saldo da conta bancária
  const atualizarSaldoConta = async (contaBancariaId: string, valorMovimentacao: number) => {
    try {
      // Buscar saldo atual da conta
      const { data: conta, error: fetchError } = await supabase
        .from('contas_bancarias')
        .select('saldo_atual')
        .eq('id', contaBancariaId)
        .single();
      
      if (fetchError) {
        console.error("Erro ao buscar saldo da conta:", fetchError);
        return false;
      }
      
      // Calcular novo saldo
      const novoSaldo = (conta.saldo_atual || 0) + valorMovimentacao;
      
      // Atualizar saldo da conta
      const { error: updateError } = await supabase
        .from('contas_bancarias')
        .update({ 
          saldo_atual: novoSaldo,
          updated_at: new Date().toISOString()
        })
        .eq('id', contaBancariaId);
      
      if (updateError) {
        console.error("Erro ao atualizar saldo da conta:", updateError);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Erro ao atualizar saldo da conta:", error);
      return false;
    }
  };

  return {
    updateLancamentoStatus,
    registrarPagamento,
    isUpdating
  };
}
