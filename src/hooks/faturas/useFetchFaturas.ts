
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Fatura, StatusHistoryEntry } from "@/types/fatura";
import { useMemo } from "react";

export const useFetchFaturas = (currentDate: Date) => {
  const queryKey = useMemo(() => ['faturas', currentDate.getMonth() + 1, currentDate.getFullYear()], [currentDate]);

  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        // Buscar todas as faturas anteriores em uma única query
        const { data: todasFaturasAnteriores, error: errorAnteriores } = await supabase
          .from("faturas")
          .select('valor_desconto, unidade_beneficiaria_id')
          .or(`ano.lt.${currentDate.getFullYear()},and(ano.eq.${currentDate.getFullYear()},mes.lt.${currentDate.getMonth() + 1})`)
          .order('ano', { ascending: false });

        if (errorAnteriores) throw errorAnteriores;

        // Buscar faturas do mês atual em uma única query
        const { data: faturasAtuais, error: errorAtuais } = await supabase
          .from("faturas")
          .select(`
            *,
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

        if (errorAtuais) throw errorAtuais;

        if (!faturasAtuais) return [];

        // Processar os dados de forma mais eficiente
        return faturasAtuais.map(fatura => {
          const economiaAcumulada = todasFaturasAnteriores
            ? todasFaturasAnteriores
                .filter(f => f.unidade_beneficiaria_id === fatura.unidade_beneficiaria.id)
                .reduce((acc, f) => acc + (f.valor_desconto || 0), 0)
            : 0;

          const historico_status = Array.isArray(fatura.historico_status) 
            ? (fatura.historico_status as StatusHistoryEntry[]).map(entry => ({
                status: entry.status,
                data: entry.data,
                observacao: entry.observacao
              }))
            : [];

          return {
            ...fatura,
            economia_acumulada: economiaAcumulada,
            historico_status,
            valor_adicional: fatura.valor_adicional || 0,
            observacao_pagamento: fatura.observacao_pagamento || null,
            data_pagamento: fatura.data_pagamento || null
          };
        }) as Fatura[];
      } catch (error) {
        console.error('Erro ao buscar faturas:', error);
        toast.error("Erro ao carregar faturas");
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000,   // 10 minutos
    retry: 1,
    retryDelay: 3000,
  });
};
