import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { UsinaFormData } from "./schema";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UnidadeUsinaSelectProps {
  form: UseFormReturn<UsinaFormData>;
}

export function UnidadeUsinaSelect({ form }: UnidadeUsinaSelectProps) {
  const { data: unidades } = useQuery({
    queryKey: ["unidades_usina"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("unidades_usina")
        .select(`
          id,
          numero_uc,
          logradouro,
          numero,
          complemento,
          cidade,
          uf,
          cep
        `)
        .eq("status", "active");
      if (error) throw error;
      return data;
    },
  });

  return (
    <FormField
      control={form.control}
      name="unidade_usina_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Unidade da Usina</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma unidade" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {unidades?.map((unidade) => (
                <SelectItem key={unidade.id} value={unidade.id}>
                  {unidade.numero_uc} - {unidade.logradouro}, {unidade.numero}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}