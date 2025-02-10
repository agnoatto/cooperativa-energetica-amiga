
import { useState } from "react";
import { FaturaEditModal } from "@/components/faturas/FaturaEditModal";
import { FaturasHeader } from "@/components/faturas/FaturasHeader";
import { MonthSelector } from "@/components/faturas/MonthSelector";
import { FaturasTable } from "@/components/faturas/FaturasTable";
import { useFaturas } from "@/hooks/useFaturas";
import { useMonthSelection } from "@/hooks/useMonthSelection";
import { Fatura, FaturaStatus } from "@/types/fatura";

export function FaturasContainer() {
  const [selectedFatura, setSelectedFatura] = useState<Fatura | null>(null);
  const { currentDate, handlePreviousMonth, handleNextMonth } = useMonthSelection();
  const { 
    faturas, 
    isLoading, 
    updateFatura,
    isUpdating,
    gerarFaturas, 
    isGenerating, 
    deleteFatura,
    updateFaturaStatus
  } = useFaturas(currentDate);

  const handleDeleteFatura = async (id: string) => {
    await deleteFatura(id);
  };

  const handleUpdateStatus = async (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => {
    await updateFaturaStatus({
      id: fatura.id,
      status: newStatus,
      observacao
    });
  };

  return (
    <div className="space-y-6">
      <FaturasHeader 
        onGerarFaturas={gerarFaturas}
        isGenerating={isGenerating}
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
        onDeleteFatura={handleDeleteFatura}
        onUpdateStatus={handleUpdateStatus}
      />

      {selectedFatura && (
        <FaturaEditModal
          isOpen={!!selectedFatura}
          onClose={() => setSelectedFatura(null)}
          fatura={selectedFatura}
          onSuccess={updateFatura}
        />
      )}
    </div>
  );
}
