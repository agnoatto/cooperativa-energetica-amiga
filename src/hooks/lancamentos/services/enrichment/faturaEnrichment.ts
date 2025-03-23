
/**
 * Serviço de enriquecimento de dados de faturas
 * 
 * Este arquivo contém funções para buscar e adicionar informações
 * detalhadas sobre faturas aos lançamentos financeiros
 */

import { supabase } from "@/integrations/supabase/client";
import { EnriquecimentoParams } from "../../core/types";

/**
 * Busca e adiciona informações detalhadas da fatura ao lançamento
 * 
 * @param params Objeto contendo lançamento e item original
 * @returns Lançamento com dados da fatura e valores atualizados
 */
export async function enriquecerDadosFatura({ 
  lancamento, 
  item 
}: EnriquecimentoParams) {
  if (!item.fatura_id) {
    return lancamento;
  }
  
  try {
    const { data: faturaData } = await supabase
      .from('faturas')
      .select(`
        id,
        mes, 
        ano,
        unidade_beneficiaria_id,
        data_vencimento,
        valor_assinatura,
        valor_adicional,
        status
      `)
      .eq('id', item.fatura_id)
      .maybeSingle();
      
    if (faturaData) {
      // Verificar se a fatura já foi enviada para o cliente
      // Se o tipo for receita, exibir apenas faturas que já foram enviadas
      if (item.tipo === 'receita' && 
          !['enviada', 'reenviada', 'atrasada', 'paga', 'finalizada'].includes(faturaData.status)) {
        // Pular este lançamento, pois a fatura ainda não foi enviada
        return null;
      }
      
      // Agora buscar a unidade beneficiária separadamente
      const { data: unidadeData } = await supabase
        .from('unidades_beneficiarias')
        .select('numero_uc, apelido, endereco')
        .eq('id', faturaData.unidade_beneficiaria_id)
        .maybeSingle();
      
      // Formatar número da fatura (usando mes/ano como referência)
      const numeroFatura = faturaData.mes && faturaData.ano 
        ? `${faturaData.mes.toString().padStart(2, '0')}/${faturaData.ano}`
        : faturaData.id;
      
      lancamento.fatura = {
        id: faturaData.id,
        numero_fatura: numeroFatura,
        mes: faturaData.mes,
        ano: faturaData.ano,
        data_vencimento: faturaData.data_vencimento,
        unidade_beneficiaria: unidadeData ? {
          numero_uc: unidadeData.numero_uc || '',
          apelido: unidadeData.apelido || null,
          endereco: unidadeData.endereco || ''
        } : {
          numero_uc: '',
          apelido: null,
          endereco: ''
        }
      };
      
      // Atualizar o valor e a data de vencimento do lançamento com base na fatura (fonte primária)
      // Isso garante que o valor exibido seja sempre consistente com a fatura
      const valorFatura = (faturaData.valor_assinatura || 0) + (faturaData.valor_adicional || 0);
      lancamento.valor = valorFatura;
      lancamento.valor_original = valorFatura;
      lancamento.data_vencimento = faturaData.data_vencimento;
    }
  } catch (e) {
    console.error('Erro ao buscar dados da fatura:', e);
  }
  
  return lancamento;
}
