
import { UseFormReturn } from "react-hook-form";
import { type UsinaFormData } from "./schema";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useState } from "react";
import { SapSelectBase } from "../ui/sap-select/SapSelectBase";
import { toast } from "sonner";

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
  const parentRef = useRef<HTMLDivElement>(null);

  const { data: investidores = [], isLoading } = useQuery({
    queryKey: ["investidores", search],
    queryFn: async () => {
      try {
        const query = supabase
          .from("investidores")
          .select("id, nome_investidor")
          .eq("status", "active");

        if (search.trim()) {
          query.ilike("nome_investidor", `%${search.trim()}%`);
        }

        const { data, error } = await query.order("nome_investidor");

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching investidores:", error);
        toast.error("Erro ao carregar investidores");
        return [];
      }
    },
  });

  const rowVirtualizer = useVirtualizer({
    count: investidores.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 5,
  });

  const selectedInvestidor = investidores.find(
    (investidor) => investidor.id === form.getValues("investidor_id")
  );

  return (
    <SapSelectBase
      name="investidor_id"
      form={form}
      label="Investidor"
      isLoading={isLoading}
      placeholder="Selecione um investidor"
      searchPlaceholder="Buscar investidor..."
      searchValue={search}
      onSearchChange={setSearch}
      selectedLabel={selectedInvestidor?.nome_investidor}
      open={open}
      onOpenChange={setOpen}
    >
      {investidores.length === 0 ? (
        <div className="py-6 text-center text-sm text-gray-500">
          Nenhum investidor encontrado
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
            const investidor = investidores[virtualRow.index];
            const isSelected = investidor.id === form.getValues("investidor_id");
            return (
              <div
                key={investidor.id}
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
                  form.setValue("investidor_id", investidor.id);
                  setOpen(false);
                }}
              >
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "text-sm",
                    isSelected ? "text-blue-900 font-medium" : "text-gray-900"
                  )}>
                    {investidor.nome_investidor}
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
