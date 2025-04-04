
import { UseFormReturn } from "react-hook-form";
import { type UsinaFormData } from "./schema";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ReactSelectField } from "../ui/react-select";
import { toast } from "sonner";

interface InvestidorSelectProps {
  form: UseFormReturn<UsinaFormData>;
}

interface Investidor {
  id: string;
  nome_investidor: string;
}

export function InvestidorSelect({ form }: InvestidorSelectProps) {
  const { data: investidores = [], isLoading } = useQuery({
    queryKey: ["investidores"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("investidores")
          .select("id, nome_investidor")
          .order("nome_investidor")
          .is("deleted_at", null)
          .limit(100);

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching investidores:", error);
        toast.error("Erro ao carregar investidores");
        return [];
      }
    },
  });

  const options = investidores.map((investidor) => ({
    value: investidor.id,
    label: investidor.nome_investidor,
  }));

  return (
    <ReactSelectField
      form={form}
      name="investidor_id"
      label="Investidor"
      options={options}
      isLoading={isLoading}
      placeholder="Selecione um investidor"
      isClearable
      isSearchable
      noOptionsMessage={() => "Nenhum investidor encontrado"}
    />
  );
}
