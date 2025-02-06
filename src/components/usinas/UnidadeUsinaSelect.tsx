
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronsUpDown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { type UsinaFormData } from "./schema";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SearchInput } from "./unidade-usina-select/SearchInput";
import { LoadingState } from "./unidade-usina-select/LoadingState";
import { VirtualizedList } from "./unidade-usina-select/VirtualizedList";

interface UnidadeUsinaSelectProps {
  form: UseFormReturn<UsinaFormData>;
}

interface UnidadeUsina {
  id: string;
  numero_uc: string;
  logradouro: string;
  numero: string;
}

export function UnidadeUsinaSelect({ form }: UnidadeUsinaSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data: unidades = [], isLoading } = useQuery<UnidadeUsina[]>({
    queryKey: ["unidades_usina"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("unidades_usina")
        .select("id, numero_uc, logradouro, numero")
        .eq("status", "active")
        .order("numero_uc");

      if (error) throw error;
      return data || [];
    },
  });

  const filteredUnidades = isLoading 
    ? [] 
    : search.trim() === ""
      ? unidades
      : unidades.filter((unidade) =>
          unidade.numero_uc.toLowerCase().includes(search.toLowerCase().trim()) ||
          (unidade.logradouro && unidade.logradouro.toLowerCase().includes(search.toLowerCase().trim()))
        );

  const selectedUnidade = unidades.find(
    (unidade) => unidade.id === form.getValues("unidade_usina_id")
  );

  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

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
                  ) : selectedUnidade ? (
                    `UC ${selectedUnidade.numero_uc} - ${selectedUnidade.logradouro || ''}, ${selectedUnidade.numero || ''}`
                  ) : (
                    "Selecione uma unidade"
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent 
              className="w-[--radix-popover-trigger-width] p-0" 
              align="start"
              side="bottom"
              sideOffset={4}
            >
              <SearchInput value={search} onChange={setSearch} />
              {isLoading ? (
                <LoadingState />
              ) : (
                <VirtualizedList
                  items={filteredUnidades}
                  selectedId={field.value}
                  onSelect={(id) => {
                    field.onChange(id);
                    setOpen(false);
                  }}
                />
              )}
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
