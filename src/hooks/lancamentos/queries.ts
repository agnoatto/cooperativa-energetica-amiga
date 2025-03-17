/**
 * Consultas para lançamentos financeiros
 * 
 * Este módulo contém funções para buscar lançamentos financeiros do Supabase
 * sem aplicar filtros, retornando todos os registros da tabela
 */

import { supabase } from "@/integrations/supabase/client";
import { UseLancamentosFinanceirosOptions, LancamentoResponse } from "./types";
import { LancamentoFinanceiro } from "@/types/financeiro";
import { Json } from "@/integrations/supabase/types";

export async function fetchLancamentos({
  tipo,
}: UseLancamentosFinanceirosOptions): Promise<LancamentoFinanceiro[]> {
  console.log('Buscando todos os lançamentos do tipo:', tipo);

  let query = supabase
    .from('lancamentos_financeiros')
    .select(`
      *,
      cooperado:cooperados!fk_lancamentos_cooperado(nome, documento),
      investidor:investidores!fk_lancamentos_investidor(nome_investidor, documento),
      fatura:faturas!fk_lancamentos_fatura(
        id,
        numero_fatura,
        unidade_beneficiaria:unidades_beneficiarias(
          numero_uc
        )
      ),
      pagamento_usina:pagamentos_usina!fk_lancamentos_pagamento_usina(
        id,
        valor_total,
        geracao_kwh,
        status,
        data_vencimento,
        data_pagamento,
        usina:usinas(
          unidade_usina:unidades_usina(
            numero_uc
          )
        )
      )
    `);

  query = query.eq('tipo', tipo);
  console.log('Filtro de tipo aplicado:', tipo);

  query = query.is('deleted_at', null);
  console.log('Filtro de deleted_at aplicado');

  query = query.order('data_vencimento', { ascending: true });
  console.log('Ordenação aplicada');

  const { data, error } = await query;

  if (error) {
    console.error('Erro detalhado ao buscar lançamentos:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    throw error;
  }

  if (!data) {
    console.log('Nenhum dado encontrado');
    return [];
  }

  console.log('Dados retornados:', {
    quantidade: data.length,
    amostra: data.slice(0, 2)
  });

  return mapLancamentosResponse(data as any);
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
      ? item.historico_status.map((hist: Json) => ({
          data: typeof hist === 'object' && hist !== null ? (hist as any).data : '',
          status_anterior: typeof hist === 'object' && hist !== null ? (hist as any).status_anterior : 'pendente',
          novo_status: typeof hist === 'object' && hist !== null ? (hist as any).novo_status : 'pendente'
        }))
      : [],
    comprovante_path: item.comprovante_path,
    comprovante_nome: item.comprovante_nome,
    comprovante_tipo: item.comprovante_tipo,
    cooperado: item.cooperado || undefined,
    investidor: item.investidor || undefined,
    fatura: item.fatura ? {
      numero_fatura: item.fatura.numero_fatura,
      unidade_beneficiaria: {
        numero_uc: item.fatura.unidade_beneficiaria.numero_uc
      }
    } : undefined,
    pagamento_usina: item.pagamento_usina ? {
      id: item.pagamento_usina.id,
      valor_total: item.pagamento_usina.valor_total,
      geracao_kwh: item.pagamento_usina.geracao_kwh,
      status: item.pagamento_usina.status,
      data_vencimento: item.pagamento_usina.data_vencimento,
      data_pagamento: item.pagamento_usina.data_pagamento,
      usina: item.pagamento_usina.usina ? {
        unidade_usina: {
          numero_uc: item.pagamento_usina.usina.unidade_usina?.numero_uc || ''
        }
      } : undefined
    } : undefined
  }));
}
