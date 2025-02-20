
import { supabase } from "@/integrations/supabase/client";
import { PagamentoData, PagamentoStatus } from "../types/pagamento";

export function usePagamentosHistorico() {
  const getPagamentosUltimos12Meses = async (pagamentoAtual: PagamentoData) => {
    const dataReferencia = new Date(pagamentoAtual.ano, pagamentoAtual.mes - 1);
    const dataInicial = new Date(dataReferencia);
    dataInicial.setMonth(dataInicial.getMonth() - 11);

    console.log("[Histórico] Buscando pagamentos de", dataInicial.toISOString(), "até", dataReferencia.toISOString());
    console.log("[Histórico] Usina ID:", pagamentoAtual.usina.id);
    console.log("[Histórico] Período:", {
      anoInicial: dataInicial.getFullYear(),
      mesInicial: dataInicial.getMonth() + 1,
      anoFinal: dataReferencia.getFullYear(),
      mesFinal: dataReferencia.getMonth() + 1
    });

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
        data_vencimento_concessionaria,
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
      .or(`and(ano.gt.${dataInicial.getFullYear()},ano.lt.${dataReferencia.getFullYear()}),and(ano.eq.${dataInicial.getFullYear()},mes.gte.${dataInicial.getMonth() + 1}),and(ano.eq.${dataReferencia.getFullYear()},mes.lte.${dataReferencia.getMonth() + 1})`)
      .order('ano', { ascending: false })
      .order('mes', { ascending: false });

    if (error) {
      console.error("[Histórico] Erro ao buscar pagamentos:", error);
      return [pagamentoAtual];
    }

    const pagamentosFiltrados = pagamentosHistorico?.filter(pagamento => {
      const dataPagamento = new Date(pagamento.ano, pagamento.mes - 1);
      return dataPagamento >= dataInicial && dataPagamento <= dataReferencia;
    }).map(pagamento => ({
      ...pagamento,
      historico_status: (pagamento.historico_status as Array<{
        data: string;
        status_anterior: PagamentoStatus;
        novo_status: PagamentoStatus;
      }>) || [],
      usina: {
        id: pagamento.usina.id,
        valor_kwh: pagamento.usina.valor_kwh,
        unidade_usina: {
          numero_uc: pagamento.usina.unidade_usina.numero_uc
        },
        investidor: {
          nome_investidor: pagamento.usina.investidor.nome_investidor
        }
      }
    })) || [];

    console.log("[Histórico] Pagamentos encontrados:", pagamentosFiltrados.length);
    pagamentosFiltrados.forEach(pagamento => {
      console.log("[Histórico] Pagamento:", {
        id: pagamento.id,
        ano: pagamento.ano,
        mes: pagamento.mes,
        valor: pagamento.valor_total
      });
    });

    return pagamentosFiltrados.length > 0 ? pagamentosFiltrados : [pagamentoAtual];
  };

  return { getPagamentosUltimos12Meses };
}
