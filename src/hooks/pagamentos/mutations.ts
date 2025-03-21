
/**
 * Funções de mutação para criar e atualizar pagamentos
 * 
 * Este arquivo contém funções para gerar pagamentos mensais e
 * atualizar o status de pagamentos existentes.
 */
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PagamentoData, PagamentoStatus, SendMethod, HistoricoStatus } from "@/components/pagamentos/types/pagamento";
import { lastDayOfMonth, startOfMonth } from "date-fns";

export const gerarPagamentos = async (currentDate: Date) => {
  const mes = currentDate.getMonth() + 1;
  const ano = currentDate.getFullYear();
  const dataVencimento = lastDayOfMonth(currentDate);
  const primeiroDiaMes = startOfMonth(currentDate);

  console.log('Iniciando geração de pagamentos para:', { mes, ano });

  // Buscar usinas ativas com data_inicio válida
  const { data: usinas, error: usinasError } = await supabase
    .from("usinas")
    .select(`
      id,
      unidade_usina:unidades_usina!inner(
        numero_uc
      ),
      investidor:investidores!inner(
        nome_investidor
      )
    `)
    .eq('status', 'active')
    .lte('data_inicio', primeiroDiaMes.toISOString())
    .is("deleted_at", null);

  if (usinasError) {
    console.error("Erro ao buscar usinas:", usinasError);
    throw usinasError;
  }

  console.log('Usinas encontradas:', usinas?.length || 0);

  const usinasComPagamento = await Promise.all(
    (usinas as any[]).map(async (usina) => {
      // Verificar se já existe pagamento para esta usina no mês/ano
      const { data: pagamentosExistentes } = await supabase
        .from("pagamentos_usina")
        .select()
        .eq("usina_id", usina.id)
        .eq("mes", mes)
        .eq("ano", ano);

      if (pagamentosExistentes && pagamentosExistentes.length > 0) {
        console.log(`Pagamento já existe para usina ${usina.id} em ${mes}/${ano}`);
        return null;
      }

      // Criar novo pagamento
      const { error: insertError } = await supabase
        .from("pagamentos_usina")
        .insert({
          usina_id: usina.id,
          mes,
          ano,
          geracao_kwh: 0,
          valor_tusd_fio_b: 0,
          tusd_fio_b: 0,
          valor_concessionaria: 0,
          valor_total: 0,
          status: "pendente",
          data_vencimento: dataVencimento.toISOString().split('T')[0],
          data_emissao: null,
          data_pagamento: null,
          historico_status: [],
          observacao: null,
          observacao_pagamento: null,
          arquivo_conta_energia_nome: null,
          arquivo_conta_energia_path: null,
          arquivo_conta_energia_tipo: null,
          arquivo_conta_energia_tamanho: null
        });

      if (insertError) {
        console.error("Erro ao inserir pagamento:", insertError);
        throw insertError;
      }

      console.log(`Pagamento criado com sucesso para usina ${usina.id}`);
      return usina;
    })
  );

  // Filtrar usinas que tiveram pagamentos gerados com sucesso
  return usinasComPagamento.filter(Boolean);
};

/**
 * Atualiza o status de um pagamento usando uma função RPC segura
 * 
 * Esta função utiliza uma RPC com SECURITY DEFINER para garantir que
 * a atualização de status ocorra mesmo com restrições de RLS.
 */
export const atualizarStatusPagamento = async (
  pagamentoId: string, 
  novoStatus: PagamentoStatus,
  method?: SendMethod
): Promise<PagamentoData> => {
  console.log('[mutations] Iniciando atualização de status:', {
    pagamentoId,
    novoStatus,
    method
  });

  try {
    const { data, error } = await supabase.rpc('update_pagamento_status', {
      p_pagamento_id: pagamentoId,
      p_novo_status: novoStatus,
      p_method: method || null
    });

    if (error) {
      console.error('[mutations] Erro ao atualizar status do pagamento:', error);
      throw new Error(`Erro ao atualizar status: ${error.message}`);
    }

    if (!data) {
      throw new Error('Nenhum dado retornado da atualização');
    }

    console.log('[mutations] Pagamento atualizado com sucesso:', data);
    
    // Buscar dados completos do pagamento para incluir informações da usina
    const { data: pagamentoCompleto, error: pagamentoError } = await supabase
      .from("pagamentos_usina")
      .select(`
        *,
        usina:usina_id (
          id,
          valor_kwh,
          investidor:investidor_id (
            nome_investidor
          ),
          unidade_usina:unidade_usina_id (
            numero_uc
          )
        )
      `)
      .eq("id", pagamentoId)
      .single();
      
    if (pagamentoError) {
      console.error('[mutations] Erro ao buscar dados completos do pagamento:', pagamentoError);
      // Mesmo com erro, retornar os dados parciais que já temos
      return data as unknown as PagamentoData;
    }
    
    // Converter o histórico de status para o formato correto
    let historicoStatus: HistoricoStatus[] = [];
    if (pagamentoCompleto.historico_status) {
      try {
        // Verificar se é um array JSON ou já um array
        if (typeof pagamentoCompleto.historico_status === 'string') {
          historicoStatus = JSON.parse(pagamentoCompleto.historico_status);
        } else if (Array.isArray(pagamentoCompleto.historico_status)) {
          historicoStatus = pagamentoCompleto.historico_status as unknown as HistoricoStatus[];
        } else {
          console.warn('[mutations] Formato do histórico de status não reconhecido:', 
            typeof pagamentoCompleto.historico_status);
        }
      } catch (e) {
        console.error('[mutations] Erro ao processar histórico de status:', e);
      }
    }
    
    // Determinar o método de envio corretamente
    let sendMethod: SendMethod = null;
    if (pagamentoCompleto.send_method) {
      if (Array.isArray(pagamentoCompleto.send_method) && pagamentoCompleto.send_method.length > 0) {
        const methodValue = pagamentoCompleto.send_method[0];
        // Garantir que é um valor válido para SendMethod
        if (methodValue === 'email' || methodValue === 'whatsapp') {
          sendMethod = methodValue;
        }
      } else if (typeof pagamentoCompleto.send_method === 'string') {
        // Se for uma string, verificar se é um valor válido
        if (pagamentoCompleto.send_method === 'email' || pagamentoCompleto.send_method === 'whatsapp') {
          sendMethod = pagamentoCompleto.send_method as SendMethod;
        }
      }
    }
    
    // Construir o objeto PagamentoData formatado corretamente
    const pagamentoFormatado: PagamentoData = {
      ...pagamentoCompleto,
      historico_status: historicoStatus,
      send_method: sendMethod,
      // Garantir que os tipos numéricos estejam corretos
      geracao_kwh: Number(pagamentoCompleto.geracao_kwh || 0),
      valor_tusd_fio_b: Number(pagamentoCompleto.valor_tusd_fio_b || 0),
      tusd_fio_b: Number(pagamentoCompleto.tusd_fio_b || 0),
      valor_concessionaria: Number(pagamentoCompleto.valor_concessionaria || 0),
      valor_total: Number(pagamentoCompleto.valor_total || 0),
      arquivo_conta_energia_tamanho: pagamentoCompleto.arquivo_conta_energia_tamanho || null
    };
    
    return pagamentoFormatado;
  } catch (error: any) {
    console.error('[mutations] Erro na atualização de status:', error);
    throw error;
  }
}
