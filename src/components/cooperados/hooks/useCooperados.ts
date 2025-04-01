
/**
 * Hook para gerenciar a lista de cooperados
 * 
 * Este hook realiza a busca de cooperados ativos no banco de dados
 * para serem utilizados em seletores e formulários.
 */

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function useCooperados() {
  const [cooperados, setCooperados] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCooperados = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cooperados')
        .select('id, nome')
        .is('data_exclusao', null)
        .order('nome');

      if (error) throw error;
      setCooperados(data || []);
    } catch (error: any) {
      toast.error("Erro ao carregar cooperados: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCooperados();
  }, []);

  return {
    cooperados,
    isLoading,
    fetchCooperados,
  };
}
