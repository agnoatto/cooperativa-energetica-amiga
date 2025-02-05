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
import { Loader2, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface InvestidorSelectProps {
  form: UseFormReturn<UsinaFormData>;
}

interface Investidor {
  id: string;
  nome_investidor: string;
}

export function InvestidorSelect({ form }: InvestidorSelectProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredInvestidores, setFilteredInvestidores] = useState<Investidor[]>([]);

  const { data: investidores, isLoading, error } = useQuery<Investidor[]>({
    queryKey: ["investidores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investidores")
        .select("id, nome_investidor")
        .eq("status", "active")
        .order("nome_investidor", { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });

  useEffect(() => {
    if (investidores) {
      setFilteredInvestidores(
        investidores.filter((inv) =>
          inv.nome_investidor.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, investidores]);

  if (error) {
    console.error("Error loading investidores:", error);
  }

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
            <SelectContent 
              className="max-h-[300px]"
              position="popper"
              sideOffset={5}
            >
              <div className="sticky top-0 bg-background px-2 py-2 border-b">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar investidor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={cn(
                      "pl-8 h-9",
                      "focus-visible:ring-1 focus-visible:ring-offset-0"
                    )}
                  />
                </div>
              </div>
              <div className="max-h-[200px] overflow-y-auto">
                {filteredInvestidores.length === 0 ? (
                  <div className="relative px-2 py-1.5 text-sm text-muted-foreground">
                    Nenhum investidor encontrado
                  </div>
                ) : (
                  filteredInvestidores.map((investidor) => (
                    <SelectItem 
                      key={investidor.id} 
                      value={investidor.id}
                      className="cursor-pointer"
                    >
                      {investidor.nome_investidor}
                    </SelectItem>
                  ))
                )}
              </div>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}