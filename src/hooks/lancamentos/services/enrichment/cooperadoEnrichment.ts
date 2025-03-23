
/**
 * Serviço de enriquecimento de dados de cooperados
 * 
 * Este arquivo contém funções para buscar e adicionar informações
 * detalhadas sobre cooperados aos lançamentos financeiros
 */

import { supabase } from "@/integrations/supabase/client";
import { EnriquecimentoParams } from "../../core/types";

/**
 * Busca e adiciona informações detalhadas do cooperado ao lançamento
 * 
 * @param params Objeto contendo lançamento e item original
 * @returns Lançamento com dados do cooperado
 */
export async function enriquecerDadosCooperado({ 
  lancamento, 
  item 
}: EnriquecimentoParams) {
  if (!item.cooperado_id) {
    return lancamento;
  }
  
  try {
    const { data: cooperadoData } = await supabase
      .from('cooperados')
      .select('nome, documento, telefone, email, numero_cadastro')
      .eq('id', item.cooperado_id)
      .maybeSingle();
      
    if (cooperadoData) {
      lancamento.cooperado = cooperadoData;
    }
  } catch (e) {
    console.error('Erro ao buscar dados do cooperado:', e);
  }
  
  return lancamento;
}
