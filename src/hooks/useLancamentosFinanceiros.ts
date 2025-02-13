
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
        `)
        .eq('tipo', tipo)
        .is('deleted_at', null);

      if (status && status !== 'todos') {
        query = query.eq('status', status);
      }

      if (dataInicio) {
        query = query.gte('data_vencimento', startOfDay(parseISO(dataInicio)).toISOString());
      }

      if (dataFim) {
        query = query.lte('data_vencimento', endOfDay(parseISO(dataFim)).toISOString());
      }

      if (busca) {
        query = query.ilike('descricao', `%${busca}%`);
      }

      const { data, error } = await query.order('data_vencimento', { ascending: true });

      if (error) {
        throw error;
      }

      // Garantir que o historico_status seja um array de HistoricoStatus
      return (data || []).map(item => ({
        ...item,
        historico_status: (item.historico_status as any[] || []).map(hist => ({
          data: hist.data,
          status_anterior: hist.status_anterior,
          novo_status: hist.novo_status
        }))
      })) as unknown as LancamentoFinanceiro[];
    },
  });
}
