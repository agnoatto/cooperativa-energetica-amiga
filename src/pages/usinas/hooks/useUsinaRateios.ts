
/**
 * Hook para buscar rateios de uma usina específica
 * 
 * Este hook faz a consulta dos rateios associados a uma usina e retorna
 * os dados enriquecidos com informações das unidades beneficiárias.
 * Permite gerenciar a distribuição dos créditos de energia entre diferentes
 * unidades consumidoras.
 */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Rateio {
  id: string;
  usina_id: string;
  unidade_beneficiaria_id: string;
  percentual: number;
  data_inicio: string;
  data_fim: string | null;
  created_at: string;
  updated_at: string;
  
  // Dados da unidade beneficiária
  unidade_beneficiaria?: {
    numero_uc: string;
    apelido?: string;
    cooperado?: {
      nome: string;
    }
  }
}

export const rateioKeys = {
  all: ['rateios'] as const,
  porUsina: (usinaId: string) => [...rateioKeys.all, 'usina', usinaId] as const,
};

export function useUsinaRateios(usinaId?: string) {
  return useQuery({
    queryKey: rateioKeys.porUsina(usinaId || ''),
    queryFn: async () => {
      if (!usinaId) return [];
      
      const { data, error } = await supabase
        .from('rateios')
        .select(`
          id,
          usina_id,
          unidade_beneficiaria_id,
          percentual,
          data_inicio,
          data_fim,
          created_at,
          updated_at,
          unidade_beneficiaria:unidade_beneficiaria_id(
            numero_uc,
            apelido,
            cooperado:cooperado_id(nome)
          )
        `)
        .eq('usina_id', usinaId)
        .order('data_inicio', { ascending: false });
        
      if (error) {
        console.error('Erro ao buscar rateios:', error);
        throw new Error(`Erro ao buscar rateios: ${error.message}`);
      }
      
      return data as Rateio[];
    },
    enabled: !!usinaId,
  });
}
