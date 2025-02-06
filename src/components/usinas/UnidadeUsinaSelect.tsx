
import { UseFormReturn } from "react-hook-form";
import { type UsinaFormData } from "./schema";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useState } from "react";
import { SapSelectBase } from "../ui/sap-select/SapSelectBase";

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
  const parentRef = useRef<HTMLDivElement>(null);

  const { data: unidades = [], isLoading } = useQuery<UnidadeUsina[]>({
    queryKey: ["unidades_usina"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("unidades_usina")
        .select("id, numero_uc, logradouro, numero")
        .or('status.eq.active,status.is.null')
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

  const rowVirtualizer = useVirtualizer({
    count: filteredUnidades.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 5,
  });

  const selectedUnidade = unidades.find(
    (unidade) => unidade.id === form.getValues("unidade_usina_id")
  );

  const getUnidadeLabel = (unidade: UnidadeUsina) => 
    `UC ${unidade.numero_uc} - ${unidade.logradouro || ''}, ${unidade.numero || ''}`;

  return (
    <SapSelectBase
      name="unidade_usina_id"
      form={form}
      label="Unidade da Usina"
      isLoading={isLoading}
      placeholder="Selecione uma unidade"
      searchPlaceholder="Buscar unidade..."
      searchValue={search}
      onSearchChange={setSearch}
      selectedLabel={selectedUnidade ? getUnidadeLabel(selectedUnidade) : undefined}
      open={open}
      onOpenChange={setOpen}
    >
      {filteredUnidades.length === 0 ? (
        <div className="py-6 text-center text-sm text-gray-500">
          Nenhuma unidade encontrada.
        </div>
      ) : (
        <div
          ref={parentRef}
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const unidade = filteredUnidades[virtualRow.index];
            const isSelected = unidade.id === form.getValues("unidade_usina_id");
            return (
              <div
                key={unidade.id}
                className={cn(
                  "absolute left-0 top-0 w-full cursor-pointer px-3 py-2",
                  "transition-colors duration-150",
                  "hover:bg-blue-50",
                  isSelected ? "bg-blue-100" : "bg-white"
                )}
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                onClick={() => {
                  form.setValue("unidade_usina_id", unidade.id);
                  setOpen(false);
                }}
              >
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "text-sm",
                    isSelected ? "text-blue-900 font-medium" : "text-gray-900"
                  )}>
                    {getUnidadeLabel(unidade)}
                  </span>
                  {isSelected && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </SapSelectBase>
  );
}
