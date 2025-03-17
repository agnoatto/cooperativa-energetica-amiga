
/**
 * Consultas para lançamentos financeiros
 * 
 * Este módulo contém funções para buscar lançamentos financeiros do Supabase
 * usando uma abordagem simplificada para evitar problemas com relacionamentos complexos
 * e possíveis restrições de segurança no banco de dados.
 */

import { supabase } from "@/integrations/supabase/client";
import { UseLancamentosFinanceirosOptions } from "./types";
import { LancamentoFinanceiro } from "@/types/financeiro";

export async function fetchLancamentos({
  tipo,
}: UseLancamentosFinanceirosOptions): Promise<LancamentoFinanceiro[]> {
  console.log('Iniciando busca por lançamentos do tipo:', tipo);

  try {
    // Abordagem 1: Consulta simplificada sem joins complexos
    const { data, error } = await supabase
      .from('lancamentos_financeiros')
      .select('*')
      .eq('tipo', tipo)
      .is('deleted_at', null);

    if (error) {
      console.error('Erro ao buscar lançamentos:', error.message);
      console.error('Detalhes do erro:', {
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }

    console.log('Lançamentos encontrados:', data?.length || 0);
    
    if (data && data.length > 0) {
      console.log('Amostra do primeiro resultado:', data[0]);
    } else {
      console.log('Nenhum lançamento encontrado');
    }

    // Agora vamos buscar as informações relacionadas separadamente
    const lancamentos = await Promise.all((data || []).map(async (item) => {
      // Objeto base do lançamento financeiro
      const lancamento: LancamentoFinanceiro = {
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
        comprovante_tipo: item.comprovante_tipo
      };

      // Buscar dados do cooperado se existir
      if (item.cooperado_id) {
        try {
          const { data: cooperadoData } = await supabase
            .from('cooperados')
            .select('nome, documento')
            .eq('id', item.cooperado_id)
            .single();

          if (cooperadoData) {
            lancamento.cooperado = {
              nome: cooperadoData.nome,
              documento: cooperadoData.documento
            };
          }
        } catch (err) {
          console.log('Erro ao buscar cooperado:', err);
        }
      }

      // Buscar dados do investidor se existir
      if (item.investidor_id) {
        try {
          const { data: investidorData } = await supabase
            .from('investidores')
            .select('nome_investidor, documento')
            .eq('id', item.investidor_id)
            .single();

          if (investidorData) {
            lancamento.investidor = {
              nome_investidor: investidorData.nome_investidor,
              documento: investidorData.documento
            };
          }
        } catch (err) {
          console.log('Erro ao buscar investidor:', err);
        }
      }

      return lancamento;
    }));

    return lancamentos;
  } catch (error) {
    console.error('Exceção não tratada ao buscar lançamentos:', error);
    return [];
  }
}
