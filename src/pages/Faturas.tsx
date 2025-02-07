
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FaturaEditModal } from "@/components/faturas/FaturaEditModal";
import { FaturasHeader } from "@/components/faturas/FaturasHeader";
import { MonthSelector } from "@/components/faturas/MonthSelector";
import { FaturasTable } from "@/components/faturas/FaturasTable";
import { useDateNavigation } from "@/components/faturas/useDateNavigation";
import { useFaturas } from "@/hooks/useFaturas";
import type { Fatura } from "@/types/fatura";

const Faturas = () => {
  const { currentDate, handlePreviousMonth, handleNextMonth } = useDateNavigation();
  const [selectedFatura, setSelectedFatura] = useState<Fatura | null>(null);
  const queryClient = useQueryClient();
  const { faturas, isLoading, gerarFaturasMutation } = useFaturas(currentDate);

  return (
    <div className="space-y-6">
      <FaturasHeader 
        onGerarFaturas={() => gerarFaturasMutation.mutate()}
        isGenerating={gerarFaturasMutation.isPending}
      />

      <MonthSelector
        currentDate={currentDate}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
      />

      <FaturasTable
        faturas={faturas}
        isLoading={isLoading}
        onEditFatura={setSelectedFatura}
      />

      {selectedFatura && (
        <FaturaEditModal
          isOpen={!!selectedFatura}
          onClose={() => setSelectedFatura(null)}
          fatura={selectedFatura}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["faturas"] });
          }}
        />
      )}
    </div>
  );
};

export default Faturas;
