
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UsinaData } from "../types";

export const usinaKeys = {
  all: ['usinas'] as const,
  lists: () => [...usinaKeys.all, 'list'] as const,
  dashboard: () => [...usinaKeys.all, 'dashboard'] as const,
};

export function useUsinas() {
  return useQuery({
    queryKey: usinaKeys.lists(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('usinas')
        .select(`
          *,
          investidor:investidores(nome_investidor),
          unidade:unidades_usina(numero_uc)
        `);

      if (error) throw error;
      return data as UsinaData[];
    },
  });
}
