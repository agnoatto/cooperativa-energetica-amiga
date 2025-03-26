
// Este hook busca os pagamentos associados a uma usina específica
// Permite visualizar o histórico de pagamentos na página de detalhes da usina

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { usinaKeys } from "./useUsinas";

export interface PagamentoUsina {
  id: string;
  usina_id: string;
  mes: number;
  ano: number;
  geracao_kwh: number;
  valor_total: number;
  status: string;
  data_vencimento: string;
  data_pagamento?: string;
  observacao?: string;
}

export function useUsinaPagamentos(usinaId?: string) {
  return useQuery({
    queryKey: [...usinaKeys.all, 'pagamentos', usinaId],
    queryFn: async () => {
      if (!usinaId) throw new Error("ID da usina não fornecido");
      
      const { data, error } = await supabase
        .from('pagamentos_usina')
        .select('*')
        .eq('usina_id', usinaId)
        .order('ano', { ascending: false })
        .order('mes', { ascending: false });

      if (error) throw error;
      return data as PagamentoUsina[];
    },
    enabled: !!usinaId,
  });
}
