
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUnidadeUsinaData = (unidadeId?: string) => {
  const { data: cooperativas } = useQuery({
    queryKey: ["cooperativas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cooperativas")
        .select("id, nome, documento")
        .is("deleted_at", null)
        .order("nome");
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
    cooperativas,
    cooperados,
  };
};
