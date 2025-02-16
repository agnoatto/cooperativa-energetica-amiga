
import { UseFormReturn } from "react-hook-form";
import { type UsinaFormData } from "./schema";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ReactSelectField } from "../ui/react-select";
import { toast } from "sonner";

interface UnidadeUsinaSelectProps {
  form: UseFormReturn<UsinaFormData>;
}

interface UnidadeUsina {
  id: string;
  numero_uc: string;
  logradouro: string;
  numero: string;
  apelido: string;
  cidade: string;
}

export function UnidadeUsinaSelect({ form }: UnidadeUsinaSelectProps) {
  const { data: unidades = [], isLoading } = useQuery({
    queryKey: ["unidades_usina"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("unidades_usina")
          .select("id, numero_uc, logradouro, numero, apelido, cidade")
          .order("numero_uc")
          .limit(100);

        if (error) throw error;
        return data || [];
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
    />
  );
}
