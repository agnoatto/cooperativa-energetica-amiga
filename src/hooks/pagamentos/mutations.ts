
import { supabase } from "@/integrations/supabase/client";
import { lastDayOfMonth, startOfMonth } from "date-fns";
import { toast } from "sonner";

export const gerarPagamentos = async (currentDate: Date) => {
  const mes = currentDate.getMonth() + 1;
  const ano = currentDate.getFullYear();
  const dataVencimento = lastDayOfMonth(currentDate);
  const primeiroDiaMes = startOfMonth(currentDate);

  console.log('Iniciando geração de pagamentos para:', { mes, ano });

  // Buscar usinas ativas com data_inicio válida
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

  if (usinasError) {
    console.error("Erro ao buscar usinas:", usinasError);
    throw usinasError;
  }

  console.log('Usinas encontradas:', usinas?.length || 0);

  const usinasComPagamento = await Promise.all(
    (usinas as any[]).map(async (usina) => {
      // Verificar se já existe pagamento para esta usina no mês/ano
      const { data: pagamentosExistentes } = await supabase
        .from("pagamentos_usina")
        .select()
        .eq("usina_id", usina.id)
        .eq("mes", mes)
        .eq("ano", ano);

      if (pagamentosExistentes && pagamentosExistentes.length > 0) {
        console.log(`Pagamento já existe para usina ${usina.id} em ${mes}/${ano}`);
        return null;
      }

      // Criar novo pagamento
      const { error: insertError } = await supabase
        .from("pagamentos_usina")
        .insert({
          usina_id: usina.id,
          mes,
          ano,
          geracao_kwh: 0,
          valor_tusd_fio_b: 0,
          tusd_fio_b: 0,
          valor_concessionaria: 0,
          valor_total: 0,
          status: "pendente",
          data_vencimento: dataVencimento.toISOString().split('T')[0],
          data_emissao: null,
          data_pagamento: null,
          historico_status: [],
          observacao: null,
          observacao_pagamento: null,
          arquivo_conta_energia_nome: null,
          arquivo_conta_energia_path: null,
          arquivo_conta_energia_tipo: null,
          arquivo_conta_energia_tamanho: null
        });

      if (insertError) {
        console.error("Erro ao inserir pagamento:", insertError);
        throw insertError;
      }

      console.log(`Pagamento criado com sucesso para usina ${usina.id}`);
      return usina;
    })
  );

  // Filtrar usinas que tiveram pagamentos gerados com sucesso
  return usinasComPagamento.filter(Boolean);
};
