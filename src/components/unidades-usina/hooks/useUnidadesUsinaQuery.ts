
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { UnidadeUsina } from "../types";

export function useUnidadesUsinaQuery(busca: string = "") {
  return useQuery({
    queryKey: ["unidades_usina", busca],
    queryFn: async () => {
      // Get all unidades_usina records with search filter
      let query = supabase
        .from("unidades_usina")
        .select("*");

      if (busca) {
        query = query.or(`numero_uc.ilike.%${busca}%,apelido.ilike.%${busca}%,logradouro.ilike.%${busca}%,bairro.ilike.%${busca}%,cidade.ilike.%${busca}%`);
      }

      const { data: unidadesData, error: unidadesError } = await query.order("created_at", { ascending: false });

      if (unidadesError) throw unidadesError;

      // Get cooperativas and cooperados data
      const { data: cooperativas } = await supabase
        .from("cooperativas")
        .select("id, nome, documento")
        .is("deleted_at", null);

      const { data: cooperados } = await supabase
        .from("cooperados")
        .select("id, nome")
        .is("data_exclusao", null);

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
