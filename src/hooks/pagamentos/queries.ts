
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth } from "date-fns";
import { toast } from "sonner";
import { PagamentoData, PagamentoStatus } from "@/components/pagamentos/types/pagamento";

export const fetchPagamentos = async (currentDate: Date) => {
  const mes = currentDate.getMonth() + 1;
  const ano = currentDate.getFullYear();
  const primeiroDiaMes = startOfMonth(currentDate);

  const { data, error } = await supabase
    .from("usinas")
    .select(`
      id,
      valor_kwh,
      data_inicio,
      status,
      modalidade,
      unidade_usina:unidades_usina!inner(
        numero_uc
      ),
      investidor:investidores!inner(
        nome_investidor
      ),
      pagamentos:pagamentos_usina(
        id,
        geracao_kwh,
        tusd_fio_b,
        valor_tusd_fio_b,
        valor_concessionaria,
        valor_total,
        conta_energia,
        status,
        data_vencimento,
        data_pagamento,
        data_emissao,
        data_confirmacao,
        data_envio,
        mes,
        ano,
        arquivo_comprovante_nome,
        arquivo_comprovante_path,
        arquivo_comprovante_tipo,
        arquivo_comprovante_tamanho,
        observacao,
        observacao_pagamento,
        historico_status,
        send_method,
        empresa_id
      )
    `)
    .eq('status', 'active')
    .lte('data_inicio', primeiroDiaMes.toISOString())
    .is("deleted_at", null);

  if (error) {
    console.error("Erro ao carregar pagamentos:", error);
    toast.error("Erro ao carregar pagamentos");
    return [];
  }

  return data.map(usina => {
    const pagamentosOrdenados = usina.pagamentos?.sort((a, b) => {
      if (a.ano !== b.ano) return b.ano - a.ano;
      return b.mes - a.mes;
    }) || [];

    const pagamentoDoMes = pagamentosOrdenados.find(p => p.mes === mes && p.ano === ano);
    
    if (pagamentoDoMes) {
      return {
        ...pagamentoDoMes,
        usina: {
          id: usina.id,
          valor_kwh: usina.valor_kwh,
          unidade_usina: usina.unidade_usina,
          investidor: usina.investidor,
          modalidade: usina.modalidade
        },
        historico_status: Array.isArray(pagamentoDoMes.historico_status) 
          ? pagamentoDoMes.historico_status.map((h: any) => ({
              data: h.data,
              status_anterior: h.status_anterior as PagamentoStatus,
              novo_status: h.novo_status as PagamentoStatus
            }))
          : []
      };
    }

    return null;
  }).filter(Boolean);
};
