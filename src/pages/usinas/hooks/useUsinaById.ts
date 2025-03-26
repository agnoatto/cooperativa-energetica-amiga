
// Este hook busca os dados de uma usina específica pelo ID
// Utilizado na página de detalhes de uma usina para mostrar informações completas

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UsinaData } from "../types";
import { usinaKeys } from "./useUsinas";

export function useUsinaById(id?: string) {
  return useQuery({
    queryKey: [...usinaKeys.all, 'detail', id],
    queryFn: async () => {
      if (!id) throw new Error("ID da usina não fornecido");
      
      const { data, error } = await supabase
        .from('usinas')
        .select(`
          *,
          investidor:investidores(id, nome_investidor, documento, email, telefone),
          unidade:unidades_usina(id, numero_uc, titular_nome:titular_id, titular_tipo, 
            logradouro, numero, complemento, bairro, cidade, uf, cep)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as UsinaData;
    },
    enabled: !!id,
  });
}
