
/**
 * Consultas para lançamentos financeiros
 * 
 * Este módulo contém funções para buscar lançamentos financeiros do Supabase
 * sem aplicar filtros, retornando todos os registros da tabela
 */

import { supabase } from "@/integrations/supabase/client";
import { UseLancamentosFinanceirosOptions } from "./types";
import { LancamentoFinanceiro } from "@/types/financeiro";

export async function fetchLancamentos({
  tipo,
}: UseLancamentosFinanceirosOptions): Promise<LancamentoFinanceiro[]> {
  console.log('Buscando todos os lançamentos do tipo:', tipo);

  try {
    // Consulta simplificada para evitar problemas com relacionamentos
    const { data, error } = await supabase
      .from('lancamentos_financeiros')
      .select(`
        *,
        cooperado:cooperados(nome, documento),
        investidor:investidores(nome_investidor, documento),
        fatura:faturas(numero_fatura, unidade_beneficiaria:unidades_beneficiarias(numero_uc)),
        pagamento_usina:pagamentos_usina(id, valor_total, geracao_kwh, status, data_vencimento, 
          data_pagamento, usina:usinas(unidade_usina:unidades_usina(numero_uc)))
      `)
      .eq('tipo', tipo)
      .is('deleted_at', null)
      .order('data_vencimento', { ascending: true });

    if (error) {
      console.error('Erro detalhado ao buscar lançamentos:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }

    console.log('Dados retornados:', {
      quantidade: data?.length || 0,
      amostra: data?.slice(0, 2) || []
    });

    return mapLancamentosResponse(data || []);
  } catch (error) {
    console.error('Exceção ao buscar lançamentos:', error);
    return [];
  }
}

function mapLancamentosResponse(data: any[]): LancamentoFinanceiro[] {
  return data.map(item => ({
    id: item.id,
    tipo: item.tipo,
    status: item.status,
    descricao: item.descricao,
    valor: item.valor,
    data_vencimento: item.data_vencimento,
    data_pagamento: item.data_pagamento,
    observacao: item.observacao,
    cooperado_id: item.cooperado_id,
    investidor_id: item.investidor_id,
    fatura_id: item.fatura_id,
    pagamento_usina_id: item.pagamento_usina_id,
    created_at: item.created_at,
    updated_at: item.updated_at,
    deleted_at: item.deleted_at,
    historico_status: Array.isArray(item.historico_status) 
      ? item.historico_status.map((hist: any) => ({
          data: typeof hist === 'object' && hist !== null ? hist.data : '',
          status_anterior: typeof hist === 'object' && hist !== null ? hist.status_anterior : 'pendente',
          novo_status: typeof hist === 'object' && hist !== null ? hist.novo_status : 'pendente'
        }))
      : [],
    comprovante_path: item.comprovante_path,
    comprovante_nome: item.comprovante_nome,
    comprovante_tipo: item.comprovante_tipo,
    cooperado: item.cooperado?.[0] || undefined,
    investidor: item.investidor?.[0] || undefined,
    fatura: item.fatura?.[0] ? {
      numero_fatura: item.fatura[0].numero_fatura,
      unidade_beneficiaria: item.fatura[0].unidade_beneficiaria ? {
        numero_uc: item.fatura[0].unidade_beneficiaria.numero_uc
      } : undefined
    } : undefined,
    pagamento_usina: item.pagamento_usina?.[0] ? {
      id: item.pagamento_usina[0].id,
      valor_total: item.pagamento_usina[0].valor_total,
      geracao_kwh: item.pagamento_usina[0].geracao_kwh,
      status: item.pagamento_usina[0].status,
      data_vencimento: item.pagamento_usina[0].data_vencimento,
      data_pagamento: item.pagamento_usina[0].data_pagamento,
      usina: item.pagamento_usina[0].usina ? {
        unidade_usina: item.pagamento_usina[0].usina.unidade_usina ? {
          numero_uc: item.pagamento_usina[0].usina.unidade_usina.numero_uc || ''
        } : undefined
      } : undefined
    } : undefined
  }));
}
