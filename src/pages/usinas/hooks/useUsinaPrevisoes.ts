
// Este hook busca as previsões de geração de uma usina específica
// Usado para exibir gráficos e projeções na página de detalhes da usina

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { usinaKeys } from "./useUsinas";

export interface PrevisaoUsina {
  id: string;
  usina_id: string;
  ano: number;
  janeiro?: number;
  fevereiro?: number;
  marco?: number;
  abril?: number;
  maio?: number;
  junho?: number;
  julho?: number;
  agosto?: number;
  setembro?: number;
  outubro?: number;
  novembro?: number;
  dezembro?: number;
}

export function useUsinaPrevisoes(usinaId?: string) {
  return useQuery({
    queryKey: [...usinaKeys.all, 'previsoes', usinaId],
    queryFn: async () => {
      if (!usinaId) throw new Error("ID da usina não fornecido");
      
      const { data, error } = await supabase
        .from('geracao_prevista_usina')
        .select('*')
        .eq('usina_id', usinaId)
        .order('ano', { ascending: false });

      if (error) throw error;
      return data as PrevisaoUsina[];
    },
    enabled: !!usinaId,
  });
}
