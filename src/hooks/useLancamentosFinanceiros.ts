
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LancamentoFinanceiro, TipoLancamento, StatusLancamento } from "@/types/financeiro";
import { startOfDay, endOfDay, parseISO } from "date-fns";

interface UseLancamentosFinanceirosOptions {
  tipo: TipoLancamento;
  status?: StatusLancamento | 'todos';
  dataInicio?: string;
  dataFim?: string;
  busca?: string;
}

export function useLancamentosFinanceiros({
  tipo,
  status,
  dataInicio,
  dataFim,
  busca,
}: UseLancamentosFinanceirosOptions) {
  return useQuery({
    queryKey: ['lancamentos', tipo, status, dataInicio, dataFim, busca],
    queryFn: async () => {
      console.log('Buscando lançamentos com parâmetros:', {
        tipo,
        status,
        dataInicio,
        dataFim,
        busca
      });

      let query = supabase
        .from('lancamentos_financeiros')
        .select(`
          *,
          cooperado:cooperados!lancamentos_financeiros_cooperado_id_fkey(nome, documento),
          investidor:investidores!fk_lancamentos_investidor(nome_investidor, documento),
          fatura:faturas!fk_lancamentos_fatura(
            id,
            unidade_beneficiaria:unidades_beneficiarias!faturas_unidade_beneficiaria_id_fkey(numero_uc)
          ),
          pagamento_usina:pagamentos_usina!lancamentos_financeiros_pagamento_usina_id_fkey(
            id,
            usina:usinas!pagamentos_usina_usina_id_fkey(
              unidade_usina:unidades_usina!usinas_unidade_usina_id_fkey(numero_uc)
            )
          )
        `)
        .eq('tipo', tipo)
        .is('deleted_at', null);

      console.log('Query base construída');

      if (status && status !== 'todos') {
        query = query.eq('status', status);
        console.log('Filtro de status aplicado:', status);
      }

      if (dataInicio) {
        const dataInicioISO = startOfDay(parseISO(dataInicio)).toISOString();
        query = query.gte('data_vencimento', dataInicioISO);
        console.log('Filtro de data início aplicado:', dataInicioISO);
      }

      if (dataFim) {
        const dataFimISO = endOfDay(parseISO(dataFim)).toISOString();
        query = query.lte('data_vencimento', dataFimISO);
        console.log('Filtro de data fim aplicado:', dataFimISO);
      }

      if (busca) {
        query = query.ilike('descricao', `%${busca}%`);
        console.log('Filtro de busca aplicado:', busca);
      }

      // Ordenar por data de vencimento
      query = query.order('data_vencimento', { ascending: true });
      console.log('Ordenação aplicada');

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar lançamentos:', error);
        throw error;
      }

      console.log('Dados retornados:', data);

      // Garantir que o historico_status seja um array de HistoricoStatus
      const lancamentos = (data || []).map(item => ({
        ...item,
        historico_status: (item.historico_status as any[] || []).map(hist => ({
          data: hist.data,
          status_anterior: hist.status_anterior,
          novo_status: hist.novo_status
        }))
      })) as unknown as LancamentoFinanceiro[];

      console.log('Lançamentos processados:', lancamentos.length);
      return lancamentos;
    },
  });
}
