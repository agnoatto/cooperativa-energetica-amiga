import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { UsinaFormData } from "./schema";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface InvestidorSelectProps {
  form: UseFormReturn<UsinaFormData>;
}

export function InvestidorSelect({ form }: InvestidorSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data: investidores, isLoading } = useQuery({
    queryKey: ["investidores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investidores")
        .select("id, nome_investidor")
        .eq("status", "active");
      if (error) throw error;
      return data || []; // Ensure we always return an array
    },
  });

  // Ensure we have an array to filter, even if investidores is undefined
  const filteredInvestidores = (investidores || []).filter((investidor) =>
    investidor.nome_investidor.toLowerCase().includes(search.toLowerCase())
  );

  const selectedInvestidor = investidores?.find(
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
                  aria-expanded={open}
                  className="w-full justify-between"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : field.value ? (
                    selectedInvestidor?.nome_investidor || "Selecione um investidor"
                  ) : (
                    "Selecione um investidor"
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput
                  placeholder="Buscar investidor..."
                  value={search}
                  onValueChange={setSearch}
                />
                <CommandEmpty>Nenhum investidor encontrado.</CommandEmpty>
                <CommandGroup>
                  {isLoading ? (
                    <div className="p-4 text-center">
                      <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                    </div>
                  ) : (
                    filteredInvestidores.map((investidor) => (
                      <CommandItem
                        key={investidor.id}
                        value={investidor.nome_investidor}
                        onSelect={() => {
                          form.setValue("investidor_id", investidor.id);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === investidor.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {investidor.nome_investidor}
                      </CommandItem>
                    ))
                  )}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}