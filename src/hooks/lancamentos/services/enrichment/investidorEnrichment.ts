
/**
 * Serviço de enriquecimento de dados de investidores
 * 
 * Este arquivo contém funções para buscar e adicionar informações
 * detalhadas sobre investidores aos lançamentos financeiros
 */

import { supabase } from "@/integrations/supabase/client";
import { EnriquecimentoParams } from "../../core/types";

/**
 * Busca e adiciona informações detalhadas do investidor ao lançamento
 * 
 * @param params Objeto contendo lançamento e item original
 * @returns Lançamento com dados do investidor
 */
export async function enriquecerDadosInvestidor({ 
  lancamento, 
  item 
}: EnriquecimentoParams) {
  if (!item.investidor_id) {
    return lancamento;
  }
  
  try {
    const { data: investidorData } = await supabase
      .from('investidores')
      .select('nome_investidor, documento, telefone, email')
      .eq('id', item.investidor_id)
      .maybeSingle();
      
    if (investidorData) {
      lancamento.investidor = investidorData;
    }
  } catch (e) {
    console.error('Erro ao buscar dados do investidor:', e);
  }
  
  return lancamento;
}
