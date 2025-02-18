
import { supabase } from "@/integrations/supabase/client";
import { PagamentoData } from "../types/pagamento";

export function usePagamentosHistorico() {
  const getPagamentosUltimos12Meses = async (pagamentoAtual: PagamentoData) => {
    const dataReferencia = new Date(pagamentoAtual.ano, pagamentoAtual.mes - 1);
    const dataInicial = new Date(dataReferencia);
    dataInicial.setMonth(dataInicial.getMonth() - 11);

    console.log("[Histórico] Buscando pagamentos de", dataInicial.toISOString(), "até", dataReferencia.toISOString());

    const { data: pagamentosHistorico, error } = await supabase
      .from('pagamentos_usina')
      .select(`
        id,
        geracao_kwh,
        tusd_fio_b,
        valor_tusd_fio_b,
        valor_concessionaria,
        valor_total,
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
        empresa_id,
        usina:usinas(
          id,
          valor_kwh,
          unidade_usina:unidades_usina(
            numero_uc
          ),
          investidor:investidores(
            nome_investidor
          )
        )
      `)
      .eq('usina_id', pagamentoAtual.usina.id)
      .lte('ano', dataReferencia.getFullYear())
      .lte('mes', dataReferencia.getMonth() + 1)
      .gte('ano', dataInicial.getFullYear())
      .gte('mes', dataInicial.getMonth() + 1)
      .order('ano', { ascending: false })
      .order('mes', { ascending: false });

    if (error) {
      console.error("[Histórico] Erro ao buscar pagamentos:", error);
      return [pagamentoAtual];
    }

    console.log("[Histórico] Pagamentos encontrados:", pagamentosHistorico?.length || 0);
    return pagamentosHistorico as PagamentoData[];
  };

  return { getPagamentosUltimos12Meses };
}
