
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { PagamentoData } from "../types/pagamento";
import { fetchPagamentosHistorico } from "@/hooks/pagamentos/queries";

export function usePagamentosHistorico() {
  const queryClient = useQueryClient();

  const getPagamentosUltimos12Meses = useCallback(
    async (pagamento: PagamentoData): Promise<PagamentoData[]> => {
      try {
        const historico = await fetchPagamentosHistorico(pagamento);
        return historico.sort((a, b) => {
          // Ordenar por ano e mês decrescente
          if (a.ano !== b.ano) return b.ano - a.ano;
          return b.mes - a.mes;
        });
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
        throw error;
      }
    },
    []
  );

  return {
    getPagamentosUltimos12Meses,
  };
}
