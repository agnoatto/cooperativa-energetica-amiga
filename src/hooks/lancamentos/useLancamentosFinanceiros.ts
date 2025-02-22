
import { useQuery } from "@tanstack/react-query";
import { UseLancamentosFinanceirosOptions } from "./types";
import { fetchLancamentos } from "./queries";

export function useLancamentosFinanceiros(options: UseLancamentosFinanceirosOptions) {
  return useQuery({
    queryKey: ['lancamentos', options.tipo, options.status, options.busca],
    queryFn: () => fetchLancamentos(options),
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
