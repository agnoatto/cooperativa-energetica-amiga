
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { UnidadeUsina } from "../types";

export function useUnidadesUsinaQuery() {
  return useQuery({
    queryKey: ["unidades_usina"],
    queryFn: async () => {
      // Get all unidades_usina records
      const { data: unidadesData, error: unidadesError } = await supabase
        .from("unidades_usina")
        .select("*")
        .order("created_at", { ascending: false });

      if (unidadesError) throw unidadesError;

      // Get cooperativas and cooperados data
      const { data: cooperativas } = await supabase
        .from("cooperativas")
        .select("id, nome, documento");

      const { data: cooperados } = await supabase
        .from("cooperados")
        .select("id, nome");

      // Create maps for quick lookups
      const cooperativasMap = new Map(
        cooperativas?.map((c) => [c.id, c]) || []
      );
      const cooperadosMap = new Map(
        cooperados?.map((c) => [c.id, c]) || []
      );

      // Combine the data
      return unidadesData?.map((unidade) => {
        const titular =
          unidade.titular_tipo === "cooperativa"
            ? cooperativasMap.get(unidade.titular_id)
            : cooperadosMap.get(unidade.titular_id);

        return {
          ...unidade,
          titular_nome: titular?.nome || "",
          cooperativa: unidade.titular_tipo === "cooperativa" ? titular : null,
          cooperado: unidade.titular_tipo === "cooperado" ? titular : null,
        };
      }) as UnidadeUsina[];
    },
  });
}
