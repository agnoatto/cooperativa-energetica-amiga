
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

interface LancamentoResponse {
  historico_status: Array<{
    data: string;
    status_anterior: StatusLancamento;
    novo_status: StatusLancamento;
  }>;
  cooperado?: {
    nome: string;
    documento: string;
  } | null;
  investidor?: {
    nome_investidor: string;
    documento: string;
  } | null;
  fatura?: {
    id: string;
    unidade_beneficiaria?: {
      numero_uc: string;
    } | null;
  } | null;
  pagamento_usina?: {
    id: string;
    usina?: {
      unidade_usina?: {
        numero_uc: string;
      } | null;
    } | null;
  } | null;
  [key: string]: any;
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
          cooperado:cooperados(nome, documento),
          investidor:investidores(nome_investidor, documento),
          fatura:faturas(
            id,
            unidade_beneficiaria:unidades_beneficiarias(numero_uc)
          ),
          pagamento_usina:pagamentos_usina(
            id,
            usina:usinas(
              unidade_usina:unidades_usina(numero_uc)
            )
          )
        `);

      console.log('Query base construída, aplicando filtros...');

      query = query.eq('tipo', tipo);
      console.log('Filtro de tipo aplicado:', tipo);

      query = query.is('deleted_at', null);
      console.log('Filtro de deleted_at aplicado');

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

      const lancamentos = (data as LancamentoResponse[]).map(item => {
        const historico_status = Array.isArray(item.historico_status) 
          ? item.historico_status.map(hist => ({
              data: hist.data,
              status_anterior: hist.status_anterior,
              novo_status: hist.novo_status
            }))
          : [];

        return {
          ...item,
          historico_status,
          cooperado: item.cooperado || null,
          investidor: item.investidor || null,
          fatura: item.fatura || null,
          pagamento_usina: item.pagamento_usina || null
        } as LancamentoFinanceiro;
      });

      console.log('Lançamentos processados:', lancamentos.length);
      return lancamentos;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
}
