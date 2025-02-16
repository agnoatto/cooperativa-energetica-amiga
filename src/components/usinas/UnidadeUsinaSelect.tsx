
import { UseFormReturn } from "react-hook-form";
import { type UsinaFormData } from "./schema";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ReactSelectField } from "../ui/react-select";
import { toast } from "sonner";

interface UnidadeUsinaSelectProps {
  form: UseFormReturn<UsinaFormData>;
  usinaId?: string;
}

interface UnidadeUsina {
  id: string;
  numero_uc: string;
  logradouro: string;
  numero: string;
  apelido: string;
  cidade: string;
  em_uso: boolean;
}

export function UnidadeUsinaSelect({ form, usinaId }: UnidadeUsinaSelectProps) {
  const { data: unidades = [], isLoading } = useQuery({
    queryKey: ["unidades_usina", usinaId],
    queryFn: async () => {
      try {
        // Primeiro, vamos buscar todas as unidades
        const { data: unidadesData, error: unidadesError } = await supabase
          .from("unidades_usina")
          .select("id, numero_uc, logradouro, numero, apelido, cidade")
          .order("numero_uc");

        if (unidadesError) throw unidadesError;

        // Agora, vamos buscar as unidades que já estão em uso
        const { data: usinasAtivas, error: usinasError } = await supabase
          .from("usinas")
          .select("unidade_usina_id")
          .is("deleted_at", null);

        if (usinasError) throw usinasError;

        // Criar um Set das unidades em uso, excluindo a unidade da usina atual
        const unidadesEmUso = new Set(
          usinasAtivas
            .filter(u => u.unidade_usina_id !== form.getValues().unidade_usina_id)
            .map(u => u.unidade_usina_id)
        );

        // Mapear as unidades com a informação de uso
        return (unidadesData || []).map(unidade => ({
          ...unidade,
          em_uso: unidadesEmUso.has(unidade.id)
        }));

      } catch (error) {
        console.error("Error fetching unidades:", error);
        toast.error("Erro ao carregar unidades");
        return [];
      }
    },
  });

  const options = unidades.map((unidade) => ({
    value: unidade.id,
    label: `UC ${unidade.numero_uc}${unidade.apelido ? ` - ${unidade.apelido}` : ''} - ${unidade.cidade || ''} - ${unidade.logradouro || ''}, ${unidade.numero || ''}`.trim().replace(/\s+/g, ' ').replace(/\s*-\s*-\s*/g, ' - '),
    isDisabled: unidade.em_uso
  }));

  return (
    <ReactSelectField
      form={form}
      name="unidade_usina_id"
      label="Unidade da Usina"
      options={options}
      isLoading={isLoading}
      placeholder="Selecione uma unidade"
      isClearable
      isSearchable
      noOptionsMessage={() => "Nenhuma unidade disponível"}
    />
  );
}
