
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Loader2, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { type UsinaFormData } from "./schema";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface InvestidorSelectProps {
  form: UseFormReturn<UsinaFormData>;
}

interface Investidor {
  id: string;
  nome_investidor: string;
}

export function InvestidorSelect({ form }: InvestidorSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data: investidores = [], isLoading } = useQuery<Investidor[]>({
    queryKey: ["investidores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investidores")
        .select("id, nome_investidor")
        .order("nome_investidor");

      if (error) throw error;
      return data || [];
    },
  });

  const filteredInvestidores = isLoading 
    ? [] 
    : investidores.filter((investidor) =>
        investidor.nome_investidor.toLowerCase().includes(search.toLowerCase())
      );

  const selectedInvestidor = investidores.find(
    (investidor) => investidor.id === form.getValues("investidor_id")
  );

  return (
    <FormField
      control={form.control}
      name="investidor_id"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Investidor</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  type="button"
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Carregando...</span>
                    </div>
                  ) : selectedInvestidor ? (
                    selectedInvestidor.nome_investidor
                  ) : (
                    "Selecione um investidor"
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
              <div className="flex items-center border-b px-3 pb-2 pt-3">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <Input
                  placeholder="Buscar investidor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 border-0 p-0 focus-visible:ring-0"
                />
                {search && (
                  <X
                    className="h-4 w-4 cursor-pointer opacity-50 hover:opacity-100"
                    onClick={() => setSearch("")}
                  />
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin opacity-50" />
                  </div>
                ) : filteredInvestidores.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    Nenhum investidor encontrado.
                  </div>
                ) : (
                  <div className="py-2">
                    {filteredInvestidores.map((investidor) => (
                      <div
                        key={investidor.id}
                        className={cn(
                          "flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-accent",
                          investidor.id === field.value && "bg-accent"
                        )}
                        onClick={() => {
                          form.setValue("investidor_id", investidor.id);
                          setOpen(false);
                        }}
                      >
                        <span>{investidor.nome_investidor}</span>
                        {investidor.id === field.value && (
                          <Check className="h-4 w-4" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
