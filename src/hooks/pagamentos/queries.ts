
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth } from "date-fns";
import { toast } from "sonner";
import { PagamentoData, PagamentoStatus } from "@/components/pagamentos/types/pagamento";

export const fetchPagamentos = async (currentDate: Date) => {
  const mes = currentDate.getMonth() + 1;
  const ano = currentDate.getFullYear();
  const primeiroDiaMes = startOfMonth(currentDate);

  console.log("[Pagamentos] Buscando pagamentos para", { mes, ano });

  const { data, error } = await supabase
    .from("pagamentos_usina")
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
      arquivo_conta_energia_nome,
      arquivo_conta_energia_path,
      arquivo_conta_energia_tipo,
      arquivo_conta_energia_tamanho,
      observacao,
      observacao_pagamento,
      historico_status,
      send_method,
      empresa_id,
      usina:usinas!inner(
        id,
        valor_kwh,
        unidade_usina:unidades_usina!inner(
          numero_uc
        ),
        investidor:investidores!inner(
          nome_investidor
        )
      )
    `)
    .eq('mes', mes)
    .eq('ano', ano);

  if (error) {
    console.error("[Pagamentos] Erro ao carregar pagamentos:", error);
    toast.error("Erro ao carregar pagamentos");
    return [];
  }

  console.log("[Pagamentos] Dados brutos:", data);

  const pagamentosProcessados = data.map(pagamento => {
    // Garantir que todos os campos obrigatórios estejam presentes
    const pagamentoProcessado: PagamentoData = {
      id: pagamento.id,
      geracao_kwh: pagamento.geracao_kwh || 0,
      tusd_fio_b: pagamento.tusd_fio_b || 0,
      valor_tusd_fio_b: pagamento.valor_tusd_fio_b || 0,
      valor_concessionaria: pagamento.valor_concessionaria || 0,
      valor_total: pagamento.valor_total || 0,
      status: pagamento.status as PagamentoStatus,
      data_vencimento: pagamento.data_vencimento,
      data_pagamento: pagamento.data_pagamento || null,
      data_emissao: pagamento.data_emissao || null,
      data_confirmacao: pagamento.data_confirmacao || null,
      data_envio: pagamento.data_envio || null,
      data_vencimento_concessionaria: pagamento.data_vencimento_concessionaria || null,
      mes: pagamento.mes,
      ano: pagamento.ano,
      arquivo_conta_energia_nome: pagamento.arquivo_conta_energia_nome || null,
      arquivo_conta_energia_path: pagamento.arquivo_conta_energia_path || null,
      arquivo_conta_energia_tipo: pagamento.arquivo_conta_energia_tipo || null,
      arquivo_conta_energia_tamanho: pagamento.arquivo_conta_energia_tamanho || null,
      observacao: pagamento.observacao || null,
      observacao_pagamento: pagamento.observacao_pagamento || null,
      historico_status: Array.isArray(pagamento.historico_status) 
        ? pagamento.historico_status.map((h: any) => ({
            data: h.data,
            status_anterior: h.status_anterior as PagamentoStatus,
            novo_status: h.novo_status as PagamentoStatus
          }))
        : [],
      send_method: pagamento.send_method || null,
      empresa_id: pagamento.empresa_id || null,
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
    };

    return pagamentoProcessado;
  });

  console.log("[Pagamentos] Dados processados:", pagamentosProcessados);
  return pagamentosProcessados;
};
