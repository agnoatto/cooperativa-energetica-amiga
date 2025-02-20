
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function useCooperadosQuery() {
  const [cooperados, setCooperados] = useState<any[]>([]);
  const [unidades, setUnidades] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async (busca: string = "", orderBy: string = "nome_asc") => {
    try {
      let query = supabase
        .from('cooperados')
        .select('*')
        .is('data_exclusao', null);

      if (busca) {
        query = query.or(`nome.ilike.%${busca}%,documento.ilike.%${busca}%,numero_cadastro.ilike.%${busca}%`);
      }

      const [field, order] = orderBy.split('_');
      query = query.order(field, { ascending: order === 'asc' });

      const { data: cooperadosData, error: cooperadosError } = await query;
      if (cooperadosError) throw cooperadosError;

      const { data: unidadesData, error: unidadesError } = await supabase
        .from('unidades_beneficiarias')
        .select('*')
        .is('data_saida', null);

      if (unidadesError) throw unidadesError;

      setCooperados(cooperadosData || []);
      setUnidades(unidadesData || []);
    } catch (error: any) {
      toast.error("Erro ao carregar dados: " + error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    cooperados,
    unidades,
    isLoading,
    fetchData,
  };
}
