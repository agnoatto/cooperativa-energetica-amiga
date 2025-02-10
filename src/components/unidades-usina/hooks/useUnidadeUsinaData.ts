
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUnidadeUsinaData = (unidadeId?: string) => {
  const { data: investidores } = useQuery({
    queryKey: ["investidores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investidores")
        .select("id, nome_investidor")
        .is("deleted_at", null)
        .order("nome_investidor");
      if (error) throw error;
      return data;
    },
  });

  const { data: cooperados } = useQuery({
    queryKey: ["cooperados"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cooperados")
        .select("id, nome")
        .is("data_exclusao", null)
        .order("nome");
      if (error) throw error;
      return data;
    },
  });

  return {
    investidores,
    cooperados,
  };
};

