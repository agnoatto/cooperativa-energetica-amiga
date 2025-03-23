
/**
 * Serviço de enriquecimento de dados de pagamentos de usina
 * 
 * Este arquivo contém funções para buscar e adicionar informações
 * detalhadas sobre pagamentos de usina aos lançamentos financeiros
 */

import { supabase } from "@/integrations/supabase/client";
import { EnriquecimentoParams } from "../../core/types";

/**
 * Busca e adiciona informações detalhadas do pagamento de usina ao lançamento
 * 
 * @param params Objeto contendo lançamento e item original
 * @returns Lançamento com dados do pagamento de usina e valores atualizados
 */
export async function enriquecerDadosPagamentoUsina({ 
  lancamento, 
  item 
}: EnriquecimentoParams) {
  if (!item.pagamento_usina_id) {
    return lancamento;
  }
  
  try {
    const { data: pagamentoData } = await supabase
      .from('pagamentos_usina')
      .select(`
        id,
        mes,
        ano,
        geracao_kwh,
        valor_total,
        status,
        data_vencimento,
        data_pagamento,
        usina_id
      `)
      .eq('id', item.pagamento_usina_id)
      .maybeSingle();
      
    if (pagamentoData) {
      // Buscar informações da usina separadamente
      let usinaInfo = null;
      
      if (pagamentoData.usina_id) {
        const { data: usinaData } = await supabase
          .from('usinas')
          .select(`
            unidade_usina_id
          `)
          .eq('id', pagamentoData.usina_id)
          .maybeSingle();
          
        if (usinaData && usinaData.unidade_usina_id) {
          const { data: unidadeUsinaData } = await supabase
            .from('unidades_usina')
            .select('numero_uc, apelido')
            .eq('id', usinaData.unidade_usina_id)
            .maybeSingle();
            
          if (unidadeUsinaData) {
            usinaInfo = {
              unidade_usina: unidadeUsinaData
            };
          }
        }
      }
      
      lancamento.pagamento_usina = {
        id: pagamentoData.id,
        mes: pagamentoData.mes,
        ano: pagamentoData.ano,
        geracao_kwh: pagamentoData.geracao_kwh,
        valor_total: pagamentoData.valor_total,
        status: pagamentoData.status,
        data_vencimento: pagamentoData.data_vencimento,
        data_pagamento: pagamentoData.data_pagamento,
        usina: usinaInfo
      };
      
      // Atualizar o valor e a data de vencimento do lançamento com base no pagamento da usina (fonte primária)
      if (pagamentoData.valor_total) {
        lancamento.valor = pagamentoData.valor_total;
        lancamento.valor_original = pagamentoData.valor_total;
      }
      if (pagamentoData.data_vencimento) {
        lancamento.data_vencimento = pagamentoData.data_vencimento;
      }
    }
  } catch (e) {
    console.error('Erro ao buscar dados do pagamento de usina:', e);
  }
  
  return lancamento;
}
