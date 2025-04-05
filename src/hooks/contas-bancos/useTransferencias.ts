
/**
 * Hook para gerenciar transferências bancárias
 * 
 * Este hook fornece funcionalidades para listar, criar e gerenciar
 * transferências entre contas bancárias.
 */
import { useState, useEffect } from "react";
import { TransferenciaBancaria, StatusTransferencia, TipoTransferencia } from "@/types/contas-bancos";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface UseTransferenciasParams {
  busca?: string;
  tipo?: TipoTransferencia;
  status?: StatusTransferencia | 'todos';
  dataInicio?: string;
  dataFim?: string;
  contaOrigemId?: string;
  contaDestinoId?: string;
}

export function useTransferencias(params: UseTransferenciasParams = {}) {
  const { 
    busca = "", 
    tipo, 
    status, 
    dataInicio, 
    dataFim,
    contaOrigemId,
    contaDestinoId
  } = params;
  
  const [data, setData] = useState<TransferenciaBancaria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTransferencias = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('transferencias_bancarias')
        .select(`
          *,
          conta_origem:contas_bancarias!conta_origem_id(*),
          conta_destino:contas_bancarias!conta_destino_id(*)
        `)
        .is('deleted_at', null);
      
      // Aplicar filtros
      if (busca) {
        query = query.or(`descricao.ilike.%${busca}%,observacao.ilike.%${busca}%`);
      }
      
      if (status && status !== 'todos') {
        query = query.eq('status', status);
      }

      if (contaOrigemId) {
        query = query.eq('conta_origem_id', contaOrigemId);
      }

      if (contaDestinoId) {
        query = query.eq('conta_destino_id', contaDestinoId);
      }
      
      // Determinar tipo de transferência
      if (tipo) {
        if (tipo === 'interna') {
          query = query.not('conta_origem_id', 'is', null)
                      .not('conta_destino_id', 'is', null);
        } else if (tipo === 'entrada') {
          query = query.is('conta_origem_id', null)
                      .not('conta_destino_id', 'is', null);
        } else if (tipo === 'saida') {
          query = query.not('conta_origem_id', 'is', null)
                      .is('conta_destino_id', null);
        }
      }

      // Filtros de data
      if (dataInicio) {
        query = query.gte('data_transferencia', dataInicio);
      }
      
      if (dataFim) {
        query = query.lte('data_transferencia', dataFim);
      }
      
      const { data: transferencias, error } = await query.order('data_transferencia', { ascending: false });
      
      if (error) throw error;
      
      // Converter o resultado para o tipo TransferenciaBancaria[]
      setData(transferencias as unknown as TransferenciaBancaria[]);
    } catch (err) {
      console.error("Erro ao buscar transferências:", err);
      setError(err instanceof Error ? err : new Error("Erro desconhecido ao buscar transferências"));
      toast.error("Erro ao buscar transferências bancárias");
    } finally {
      setIsLoading(false);
    }
  };

  const realizarTransferencia = async (transferencia: Partial<TransferenciaBancaria>) => {
    try {
      setIsLoading(true);
      
      // Validações básicas
      if (!transferencia.conta_origem_id && !transferencia.conta_destino_id) {
        throw new Error("É necessário informar pelo menos uma conta de origem ou destino");
      }
      
      if (!transferencia.valor || transferencia.valor <=.0) {
        throw new Error("É necessário informar um valor válido para a transferência");
      }

      // Determinar tipo de transferência para descrição padrão se não informada
      let descricaoPadrao = "Transferência";
      if (transferencia.conta_origem_id && transferencia.conta_destino_id) {
        descricaoPadrao = "Transferência entre contas";
      } else if (transferencia.conta_destino_id) {
        descricaoPadrao = "Depósito/Entrada";
      } else if (transferencia.conta_origem_id) {
        descricaoPadrao = "Saque/Saída";
      }

      const novaTransferencia = {
        ...transferencia,
        descricao: transferencia.descricao || descricaoPadrao,
        data_transferencia: transferencia.data_transferencia || new Date().toISOString(),
        status: transferencia.status || 'pendente',
        valor: transferencia.valor || 0, // Garantir que valor seja fornecido
        // O próprio Supabase preencherá o empresa_id através do trigger propagar_empresa_id_contas
      };
      
      const { data: resultado, error } = await supabase
        .from('transferencias_bancarias')
        .insert(novaTransferencia)
        .select();
      
      if (error) throw error;

      // Se for transferência confirmada, atualizar os saldos das contas
      if (novaTransferencia.status === 'concluida') {
        await atualizarSaldosContas(
          novaTransferencia.conta_origem_id, 
          novaTransferencia.conta_destino_id, 
          novaTransferencia.valor
        );
      }
      
      toast.success("Transferência registrada com sucesso!");
      return resultado ? resultado[0] : null;
      
    } catch (err) {
      console.error("Erro ao realizar transferência:", err);
      toast.error(err instanceof Error ? err.message : "Erro ao realizar transferência");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const atualizarStatusTransferencia = async (
    transferenciaId: string, 
    novoStatus: StatusTransferencia,
    observacao?: string
  ) => {
    try {
      setIsLoading(true);
      
      // Buscar a transferência atual
      const { data: transferencia, error: fetchError } = await supabase
        .from('transferencias_bancarias')
        .select('*')
        .eq('id', transferenciaId)
        .single();
      
      if (fetchError) throw fetchError;
      if (!transferencia) throw new Error("Transferência não encontrada");
      
      // Preparar histórico de status
      const historicoAtual = transferencia.historico_status || [];
      // Verificar se historico_status é iterável e converter caso necessário
      const historicoArray = Array.isArray(historicoAtual) ? historicoAtual : [];
      
      const novoHistorico = [
        ...historicoArray,
        {
          data: new Date().toISOString(),
          status_anterior: transferencia.status,
          novo_status: novoStatus,
          observacao: observacao || `Status alterado de ${transferencia.status} para ${novoStatus}`
        }
      ];
      
      // Atualizar status da transferência
      const { error: updateError } = await supabase
        .from('transferencias_bancarias')
        .update({ 
          status: novoStatus,
          historico_status: novoHistorico,
          observacao: observacao ? `${transferencia.observacao || ''}\n${observacao}` : transferencia.observacao,
          data_conciliacao: novoStatus === 'concluida' ? new Date().toISOString() : transferencia.data_conciliacao
        })
        .eq('id', transferenciaId);
      
      if (updateError) throw updateError;
      
      // Se o novo status for concluído, atualizar saldos das contas
      if (novoStatus === 'concluida' && transferencia.status !== 'concluida') {
        await atualizarSaldosContas(
          transferencia.conta_origem_id, 
          transferencia.conta_destino_id, 
          transferencia.valor
        );
      }
      
      // Se estava concluída e agora foi cancelada, reverter saldos
      if (transferencia.status === 'concluida' && novoStatus !== 'concluida') {
        await atualizarSaldosContas(
          transferencia.conta_destino_id, // invertemos origem e destino
          transferencia.conta_origem_id, 
          transferencia.valor
        );
      }
      
      toast.success(`Status da transferência atualizado para ${novoStatus}`);
      return true;
      
    } catch (err) {
      console.error("Erro ao atualizar status da transferência:", err);
      toast.error("Erro ao atualizar status da transferência");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Função para atualizar saldos das contas
  const atualizarSaldosContas = async (
    contaOrigemId?: string | null, 
    contaDestinoId?: string | null, 
    valor?: number
  ) => {
    if (!valor || valor <= 0) return;
    
    try {
      // Se tiver conta de origem, diminuir o saldo
      if (contaOrigemId) {
        const { data: contaOrigem, error: fetchOrigemError } = await supabase
          .from('contas_bancarias')
          .select('saldo_atual')
          .eq('id', contaOrigemId)
          .single();
        
        if (fetchOrigemError) throw fetchOrigemError;
        
        const { error: updateOrigemError } = await supabase
          .from('contas_bancarias')
          .update({ 
            saldo_atual: (contaOrigem.saldo_atual || 0) - valor,
            updated_at: new Date().toISOString()
          })
          .eq('id', contaOrigemId);
        
        if (updateOrigemError) throw updateOrigemError;
      }
      
      // Se tiver conta de destino, aumentar o saldo
      if (contaDestinoId) {
        const { data: contaDestino, error: fetchDestinoError } = await supabase
          .from('contas_bancarias')
          .select('saldo_atual')
          .eq('id', contaDestinoId)
          .single();
        
        if (fetchDestinoError) throw fetchDestinoError;
        
        const { error: updateDestinoError } = await supabase
          .from('contas_bancarias')
          .update({ 
            saldo_atual: (contaDestino.saldo_atual || 0) + valor,
            updated_at: new Date().toISOString()
          })
          .eq('id', contaDestinoId);
        
        if (updateDestinoError) throw updateDestinoError;
      }
    } catch (err) {
      console.error("Erro ao atualizar saldos das contas:", err);
      toast.error("Erro ao atualizar saldos das contas");
    }
  };

  useEffect(() => {
    fetchTransferencias();
  }, [busca, tipo, status, dataInicio, dataFim, contaOrigemId, contaDestinoId]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchTransferencias,
    realizarTransferencia,
    atualizarStatusTransferencia
  };
}
