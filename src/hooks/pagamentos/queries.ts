
import { supabase } from "@/integrations/supabase/client";
import { PagamentoData, HistoricoStatus } from "@/components/pagamentos/types/pagamento";

export const fetchPagamentos = async (currentDate: Date) => {
  const mes = currentDate.getMonth() + 1;
  const ano = currentDate.getFullYear();

  const { data, error } = await supabase
    .from("pagamentos_usina")
    .select(`
      *,
      usina:usina_id (
        id,
        valor_kwh,
        investidor (
          nome_investidor
        ),
        unidade_usina (
          numero_uc
        )
      )
    `)
    .eq("mes", mes)
    .eq("ano", ano)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar pagamentos:", error);
    throw error;
  }

  // Converter dados e garantir que o histórico_status está no formato correto
  return (data as any[]).map(pagamento => ({
    ...pagamento,
    historico_status: ((pagamento.historico_status || []) as any[]).map(historico => ({
      data: historico.data,
      status_anterior: historico.status_anterior,
      novo_status: historico.novo_status
    }))
  })) as PagamentoData[];
};

export const fetchPagamentosHistorico = async (pagamentoAtual: PagamentoData): Promise<PagamentoData[]> => {
  const { data, error } = await supabase
    .from("pagamentos_usina")
    .select(`
      *,
      usina:usina_id (
        id,
        valor_kwh,
        investidor (
          nome_investidor
        ),
        unidade_usina (
          numero_uc
        )
      )
    `)
    .eq("usina_id", pagamentoAtual.usina_id)
    .order("ano", { ascending: false })
    .order("mes", { ascending: false })
    .limit(12);

  if (error) {
    console.error("Erro ao buscar histórico de pagamentos:", error);
    throw error;
  }

  // Converter dados e garantir que o histórico_status está no formato correto
  return (data as any[]).map(pagamento => ({
    ...pagamento,
    historico_status: ((pagamento.historico_status || []) as any[]).map(historico => ({
      data: historico.data,
      status_anterior: historico.status_anterior,
      novo_status: historico.novo_status
    }))
  })) as PagamentoData[];
};
