import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { UsinaFormData } from "./schema";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

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
      const { data, error } = await supabase
        .from("investidores")
        .select("id, nome_investidor")
        .eq("status", "active")
        .order("nome_investidor");

      if (error) {
        console.error("Error fetching investidores:", error);
        throw error;
      }
      return data || [];
    },
  });

  return (
    <FormField
      control={form.control}
      name="investidor_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Investidor</FormLabel>
          <Select
            disabled={isLoading}
            onValueChange={field.onChange}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <SelectValue placeholder="Selecione um investidor" />
                )}
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {investidores.map((investidor) => (
                <SelectItem key={investidor.id} value={investidor.id}>
                  {investidor.nome_investidor}
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