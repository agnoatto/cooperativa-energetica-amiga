
/**
 * Hook para consulta de lançamentos financeiros
 * 
 * Este hook utiliza React Query para buscar lançamentos financeiros
 * do backend, sem aplicar filtros adicionais
 */

import { useQuery } from "@tanstack/react-query";
import { UseLancamentosFinanceirosOptions } from "./types";
import { fetchLancamentos } from "./queries";

export function useLancamentosFinanceiros(options: UseLancamentosFinanceirosOptions) {
  return useQuery({
    queryKey: ['lancamentos', options.tipo],
    queryFn: () => fetchLancamentos(options),
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
