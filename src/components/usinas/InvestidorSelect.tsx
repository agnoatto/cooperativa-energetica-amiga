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
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface InvestidorSelectProps {
  form: UseFormReturn<UsinaFormData>;
}

interface Investidor {
  id: string;
  nome_investidor: string;
}

export function InvestidorSelect({ form }: InvestidorSelectProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: investidores, isLoading } = useQuery<Investidor[]>({
    queryKey: ["investidores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investidores")
        .select("id, nome_investidor")
        .eq("status", "active")
        .ilike("nome_investidor", `%${searchTerm}%`)
        .order("nome_investidor", { ascending: true });
      
      if (error) throw error;
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
                <SelectValue placeholder="Selecione um investidor">
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    investidores?.find(inv => inv.id === field.value)?.nome_investidor || 
                    "Selecione um investidor"
                  )}
                </SelectValue>
              </SelectTrigger>
            </FormControl>
            <SelectContent className="max-h-[200px] overflow-y-auto">
              <div className="sticky top-0 bg-background p-2">
                <Input
                  placeholder="Buscar investidor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-8"
                />
              </div>
              {investidores?.map((investidor) => (
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