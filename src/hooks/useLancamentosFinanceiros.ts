
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

interface HistoricoStatus {
  data: string;
  status_anterior: StatusLancamento;
  novo_status: StatusLancamento;
}

interface LancamentoResponse {
  id: string;
  tipo: TipoLancamento;
  status: StatusLancamento;
  descricao: string;
  valor: number;
  data_vencimento: string;
  data_pagamento?: string;
  observacao?: string;
  cooperado_id?: string;
  investidor_id?: string;
  fatura_id?: string;
  pagamento_usina_id?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  historico_status: HistoricoStatus[] | null;
  comprovante_path?: string;
  comprovante_nome?: string;
  comprovante_tipo?: string;
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
    numero_fatura: string;
    unidade_beneficiaria: {
      numero_uc: string;
    };
  } | null;
  pagamento_usina?: {
    id: string;
    usina?: {
      unidade_usina?: {
        numero_uc: string;
      } | null;
    } | null;
  } | null;
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
          cooperado:cooperados!fk_lancamentos_cooperado(nome, documento),
          investidor:investidores!fk_lancamentos_investidor(nome_investidor, documento),
          fatura:faturas(
            id,
            numero_fatura,
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

      const lancamentos: LancamentoFinanceiro[] = (data as unknown as LancamentoResponse[]).map(item => ({
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
        historico_status: (item.historico_status || []).map(hist => ({
          data: typeof hist === 'object' && hist !== null ? (hist as HistoricoStatus).data : '',
          status_anterior: typeof hist === 'object' && hist !== null ? (hist as HistoricoStatus).status_anterior : 'pendente',
          novo_status: typeof hist === 'object' && hist !== null ? (hist as HistoricoStatus).novo_status : 'pendente'
        })),
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
          ...item.pagamento_usina,
          usina: item.pagamento_usina.usina ? {
            unidade_usina: {
              numero_uc: item.pagamento_usina.usina.unidade_usina?.numero_uc || ''
            }
          } : undefined
        } : undefined
      }));

      console.log('Lançamentos processados:', lancamentos.length);
      return lancamentos;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
}
