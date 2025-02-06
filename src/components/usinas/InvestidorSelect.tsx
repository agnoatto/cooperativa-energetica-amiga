
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";
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
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Buscar investidor..."
                  value={search}
                  onValueChange={setSearch}
                  className="h-9"
                  disabled={isLoading}
                />
                <CommandEmpty>Nenhum investidor encontrado.</CommandEmpty>
                <CommandGroup>
                  {isLoading ? (
                    <CommandItem disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Carregando...
                    </CommandItem>
                  ) : filteredInvestidores.length === 0 ? (
                    <CommandItem disabled>Nenhum resultado encontrado.</CommandItem>
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
                        {investidor.nome_investidor}
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            investidor.id === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
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
