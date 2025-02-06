
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Loader2, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
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
    : unidades.filter((unidade) =>
        unidade.numero_uc.toLowerCase().includes(search.toLowerCase()) ||
        (unidade.logradouro && unidade.logradouro.toLowerCase().includes(search.toLowerCase()))
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
            <PopoverContent className="w-[400px] p-0" align="start">
              <div className="flex items-center border-b px-3 pb-2 pt-3">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <Input
                  placeholder="Buscar unidade..."
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
                ) : filteredUnidades.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    Nenhuma unidade encontrada.
                  </div>
                ) : (
                  <div className="py-2">
                    {filteredUnidades.map((unidade) => (
                      <div
                        key={unidade.id}
                        className={cn(
                          "flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-accent",
                          unidade.id === field.value && "bg-accent"
                        )}
                        onClick={() => {
                          form.setValue("unidade_usina_id", unidade.id);
                          setOpen(false);
                        }}
                      >
                        <span>
                          UC {unidade.numero_uc} - {unidade.logradouro || ''}, {unidade.numero || ''}
                        </span>
                        {unidade.id === field.value && (
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
