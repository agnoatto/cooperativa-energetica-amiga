
import { supabase } from "@/integrations/supabase/client";
import { lastDayOfMonth, startOfMonth } from "date-fns";
import { toast } from "sonner";

export const gerarPagamentos = async (currentDate: Date) => {
  const mes = currentDate.getMonth() + 1;
  const ano = currentDate.getFullYear();
  const primeiroDiaMes = startOfMonth(currentDate);
  const dataVencimento = lastDayOfMonth(currentDate);

  const { data: usinas, error: usinasError } = await supabase
    .from("usinas")
    .select(`
      id,
      unidade_usina:unidades_usina!inner(
        numero_uc
      ),
      investidor:investidores!inner(
        nome_investidor
      )
    `)
    .eq('status', 'active')
    .lte('data_inicio', primeiroDiaMes.toISOString())
    .is("deleted_at", null);

  if (usinasError) throw usinasError;

  const usinasComPagamento = await Promise.all(
    (usinas as any[]).map(async (usina) => {
      const { data: pagamentosExistentes } = await supabase
        .from("pagamentos_usina")
        .select()
        .eq("usina_id", usina.id)
        .eq("mes", mes)
        .eq("ano", ano);

      if (pagamentosExistentes && pagamentosExistentes.length > 0) {
        return null;
      }

      const { error: insertError } = await supabase
        .from("pagamentos_usina")
        .insert({
          usina_id: usina.id,
          mes,
          ano,
          geracao_kwh: 0,
          valor_tusd_fio_b: 0,
          valor_concessionaria: 0,
          valor_total: 0,
          conta_energia: 0,
          status: "pendente",
          data_vencimento: dataVencimento.toISOString().split('T')[0],
          data_emissao: null,
          data_pagamento: null,
          historico_status: [],
          observacao: null,
          observacao_pagamento: null
        });

      if (insertError) throw insertError;
      return usina;
    })
  );

  return usinasComPagamento.filter(Boolean);
};
