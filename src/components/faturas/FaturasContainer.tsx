
import { useState } from "react";
import { FaturaEditModal } from "@/components/faturas/FaturaEditModal";
import { FaturasHeader } from "@/components/faturas/FaturasHeader";
import { MonthSelector } from "@/components/faturas/MonthSelector";
import { FaturasTable } from "@/components/faturas/FaturasTable";
import { useFaturas } from "@/hooks/useFaturas";
import { useMonthSelection } from "@/hooks/useMonthSelection";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { useIsMobile } from "@/hooks/use-mobile";

export function FaturasContainer() {
  const [selectedFatura, setSelectedFatura] = useState<Fatura | null>(null);
  const { currentDate, handlePreviousMonth, handleNextMonth } = useMonthSelection();
  const isMobile = useIsMobile();
  
  const { 
    faturas, 
    isLoading, 
    updateFatura,
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 space-y-4 p-4 md:p-6">
        <FaturasHeader 
          onGerarFaturas={gerarFaturas}
          isGenerating={isGenerating}
        />

        <MonthSelector
          currentDate={currentDate}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
        />

        <div className={isMobile ? "space-y-4" : "-mx-4 md:mx-0"}>
          <FaturasTable
            faturas={faturas}
            isLoading={isLoading}
            onEditFatura={setSelectedFatura}
            onDeleteFatura={handleDeleteFatura}
            onUpdateStatus={handleUpdateStatus}
          />
        </div>

        {selectedFatura && (
          <FaturaEditModal
            isOpen={!!selectedFatura}
            onClose={() => setSelectedFatura(null)}
            fatura={selectedFatura}
            onSuccess={updateFatura}
          />
        )}
      </div>
    </div>
  );
}
