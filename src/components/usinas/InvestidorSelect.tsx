
import { UseFormReturn } from "react-hook-form";
import { type UsinaFormData } from "./schema";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ReactSelectField } from "../ui/react-select";
import { toast } from "sonner";
import { Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface InvestidorSelectProps {
  form: UseFormReturn<UsinaFormData>;
}

interface Investidor {
  id: string;
  nome_investidor: string;
  status: string;
}

export function InvestidorSelect({ form }: InvestidorSelectProps) {
  const { data: investidores = [], isLoading } = useQuery({
    queryKey: ["investidores"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("investidores")
          .select("id, nome_investidor, status")
          .order("nome_investidor")
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
    status: investidor.status,
  }));

  const formatOptionLabel = ({ label, status }: { label: string; status?: string }) => (
    <div className="flex items-center justify-between gap-2">
      <span>{label}</span>
      {status === 'active' ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <AlertCircle className="h-4 w-4 text-yellow-500" />
      )}
    </div>
  );

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
      formatOptionLabel={formatOptionLabel}
      noOptionsMessage={() => "Nenhum investidor encontrado"}
      classNames={{
        option: (state) => cn(
          "flex items-center justify-between",
          state.isFocused && "bg-accent"
        )
      }}
    />
  );
}
