
import useSWR from 'swr';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Fatura } from "@/types/fatura";

export const useFetchFaturas = (currentDate: Date) => {
  const { data, error, isLoading } = useSWR<Fatura[]>(
    ['faturas', currentDate],
    async () => {
      // Primeiro, buscar todas as faturas anteriores para calcular a economia acumulada
      const { data: faturasAnteriores } = await supabase
        .from("faturas")
        .select('valor_desconto, unidade_beneficiaria_id')
        .lt('ano', currentDate.getFullYear())
        .order('ano', { ascending: false });

      const { data: faturasAnoAtual } = await supabase
        .from("faturas")
        .select('valor_desconto, unidade_beneficiaria_id, mes')
        .eq('ano', currentDate.getFullYear())
        .lt('mes', currentDate.getMonth() + 1)
        .order('mes', { ascending: false });

      // Combinar todas as faturas anteriores
      const todasFaturasAnteriores = [...(faturasAnteriores || []), ...(faturasAnoAtual || [])];

      // Buscar faturas do mês atual
      const { data, error } = await supabase
        .from("faturas")
        .select(`
          id,
          consumo_kwh,
          valor_total,
          status,
          data_vencimento,
          mes,
          ano,
          fatura_concessionaria,
          total_fatura,
          iluminacao_publica,
          outros_valores,
          valor_desconto,
          economia_acumulada,
          saldo_energia_kwh,
          observacao,
          data_envio,
          data_confirmacao_pagamento,
          historico_status,
          unidade_beneficiaria:unidade_beneficiaria_id (
            id,
            numero_uc,
            apelido,
            endereco,
            percentual_desconto,
            cooperado:cooperado_id (
              nome,
              documento
            )
          )
        `)
        .eq("mes", currentDate.getMonth() + 1)
        .eq("ano", currentDate.getFullYear());

      if (error) {
        toast.error("Erro ao carregar faturas");
        throw error;
      }

      // Calcular economia acumulada para cada fatura e garantir o tipo correto do historico_status
      return data.map(fatura => ({
        ...fatura,
        economia_acumulada: todasFaturasAnteriores
          .filter(f => f.unidade_beneficiaria_id === fatura.unidade_beneficiaria.id)
          .reduce((acc, f) => acc + (f.valor_desconto || 0), 0),
        historico_status: (fatura.historico_status as any[] || []).map(entry => ({
          status: entry.status,
          data: entry.data,
          observacao: entry.observacao
        }))
      })) as Fatura[];
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      shouldRetryOnError: true
    }
  );

  return {
    data,
    isLoading,
    error
  };
};
