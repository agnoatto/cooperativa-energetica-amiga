import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { type UsinaFormData } from "./schema";

interface InvestidorSelectProps {
  form: UseFormReturn<UsinaFormData>;
}

interface Investidor {
  id: string;
  nome_investidor: string;
}

export function InvestidorSelect({ form }: InvestidorSelectProps) {
  const [open, setOpen] = useState(false);

  const { data: investidores, isLoading, error } = useQuery({
    queryKey: ["investidores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investidores")
        .select("id, nome_investidor")
        .order("nome_investidor");

      if (error) {
        console.error("Error fetching investidores:", error);
        throw error;
      }

      return (data || []) as Investidor[];
    },
  });

  if (error) {
    console.error("Error loading investidores:", error);
  }

  const safeInvestidores = investidores || [];

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
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : field.value ? (
                    safeInvestidores.find((investidor) => investidor.id === field.value)
                      ?.nome_investidor
                  ) : (
                    "Selecione um investidor"
                  )}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput
                  placeholder="Buscar investidor..."
                  className="h-9"
                />
                <CommandEmpty>Nenhum investidor encontrado.</CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-auto">
                  {safeInvestidores.map((investidor) => (
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
                  ))}
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