
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { PagamentoData } from "../types/pagamento";
import { fetchPagamentosHistorico } from "@/hooks/pagamentos/queries";

export function usePagamentosHistorico() {
  const queryClient = useQueryClient();

  const getPagamentosUltimos12Meses = useCallback(
    async (pagamento: PagamentoData): Promise<PagamentoData[]> => {
      return fetchPagamentosHistorico(pagamento);
    },
    []
  );

  return {
    getPagamentosUltimos12Meses,
  };
}
