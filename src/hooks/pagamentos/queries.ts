
import { supabase } from "@/integrations/supabase/client";
import { PagamentoData } from "@/components/pagamentos/types/pagamento";

export const fetchPagamentos = async (currentDate: Date): Promise<PagamentoData[]> => {
  const mes = currentDate.getMonth() + 1;
  const ano = currentDate.getFullYear();

  const { data, error } = await supabase
    .from("pagamentos_usina")
    .select(`
      *,
      usina:usina_id (
        id,
        valor_kwh,
        investidor:investidor_id (
          nome_investidor
        ),
        unidade_usina:unidade_usina_id (
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

  return (data || []).map(pagamento => ({
    ...pagamento,
    send_method: pagamento.send_method?.[0] || null, // Pega o primeiro método do array ou null
    historico_status: ((pagamento.historico_status || []) as any[]).map(historico => ({
      data: historico.data,
      status_anterior: historico.status_anterior,
      novo_status: historico.novo_status
    }))
  })) as PagamentoData[];
};

export const fetchPagamentosHistorico = async (pagamentoAtual: PagamentoData): Promise<PagamentoData[]> => {
  // Calcula a data do pagamento atual
  const dataAtual = new Date(pagamentoAtual.ano, pagamentoAtual.mes - 1);

  // Buscar pagamentos incluindo o mês atual e anteriores
  const { data, error } = await supabase
    .from("pagamentos_usina")
    .select(`
      *,
      usina:usina_id (
        id,
        valor_kwh,
        investidor:investidor_id (
          nome_investidor
        ),
        unidade_usina:unidade_usina_id (
          numero_uc
        )
      )
    `)
    .eq("usina_id", pagamentoAtual.usina_id)
    .or(`ano.lt.${pagamentoAtual.ano},and(ano.eq.${pagamentoAtual.ano},mes.lte.${pagamentoAtual.mes})`)
    .order("ano", { ascending: false })
    .order("mes", { ascending: false })
    .limit(12);

  if (error) {
    console.error("Erro ao buscar histórico de pagamentos:", error);
    throw error;
  }

  return (data || []).map(pagamento => ({
    ...pagamento,
    send_method: pagamento.send_method?.[0] || null, // Pega o primeiro método do array ou null
    historico_status: ((pagamento.historico_status || []) as any[]).map(historico => ({
      data: historico.data,
      status_anterior: historico.status_anterior,
      novo_status: historico.novo_status
    }))
  })) as PagamentoData[];
};
