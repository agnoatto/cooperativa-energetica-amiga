
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { UnidadeUsina } from "../types";

export function useUnidadesUsinaQuery() {
  return useQuery({
    queryKey: ["unidades_usina"],
    queryFn: async () => {
      const { data: unidadesData, error: unidadesError } = await supabase
        .from("unidades_usina")
        .select(`
          *,
          cooperativa:cooperativas!inner(id, nome, documento),
          cooperado:cooperados!inner(id, nome)
        `)
        .order("created_at", { ascending: false });

      if (unidadesError) throw unidadesError;

      return unidadesData?.map((unidade) => ({
        ...unidade,
        titular_nome:
          unidade.titular_tipo === "cooperativa"
            ? unidade.cooperativa?.nome
            : unidade.cooperado?.nome,
      })) as UnidadeUsina[];
    },
  });
}
