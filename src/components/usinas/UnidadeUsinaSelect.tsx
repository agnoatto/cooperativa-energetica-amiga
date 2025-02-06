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
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { UsinaFormData } from "./schema";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface UnidadeUsina {
  id: string;
  numero_uc: string;
  logradouro: string;
  numero: string;
}

interface UnidadeUsinaSelectProps {
  form: UseFormReturn<UsinaFormData>;
}

export function UnidadeUsinaSelect({ form }: UnidadeUsinaSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data: unidades = [], isLoading } = useQuery({
    queryKey: ["unidades_usina"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("unidades_usina")
        .select("id, numero_uc, logradouro, numero")
        .eq("status", "active")
        .order("numero_uc");

      if (error) {
        console.error("Error fetching unidades:", error);
        throw error;
      }
      return data || [];
    },
  });

  const filteredUnidades = unidades.filter((unidade) =>
    unidade.numero_uc.toLowerCase().includes(search.toLowerCase()) ||
    unidade.logradouro?.toLowerCase().includes(search.toLowerCase())
  );

  const selectedUnidade = unidades.find(
    (unidade) => unidade.id === form.getValues("unidade_usina_id")
  );

  return (
    <FormField
      control={form.control}
      name="unidade_usina_id"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Unidade da Usina</FormLabel>
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
                  ) : selectedUnidade ? (
                    `UC ${selectedUnidade.numero_uc} - ${selectedUnidade.logradouro || ''}, ${selectedUnidade.numero || ''}`
                  ) : (
                    "Selecione uma unidade"
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            {open && (
              <PopoverContent className="w-[400px] p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder="Buscar unidade..."
                    value={search}
                    onValueChange={setSearch}
                    className="h-9"
                  />
                  <CommandEmpty>Nenhuma unidade encontrada.</CommandEmpty>
                  <CommandGroup className="max-h-[300px] overflow-y-auto">
                    {filteredUnidades.map((unidade) => (
                      <CommandItem
                        key={unidade.id}
                        value={unidade.id}
                        onSelect={() => {
                          form.setValue("unidade_usina_id", unidade.id);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            unidade.id === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        UC {unidade.numero_uc} - {unidade.logradouro || ''}, {unidade.numero || ''}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            )}
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}