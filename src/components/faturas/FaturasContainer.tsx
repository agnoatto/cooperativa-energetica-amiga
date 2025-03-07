
import { useState } from "react";
import { MonthSelector } from "./MonthSelector";
import { FaturasTable } from "./FaturasTable";
import { FaturasHeader } from "./FaturasHeader";
import { useFaturas } from "@/hooks/useFaturas";
import { useMonthSelection } from "@/hooks/useMonthSelection";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { PaymentConfirmationModal } from "./PaymentConfirmationModal";
import { UpdateFaturaInput } from "@/hooks/faturas/useUpdateFatura";

export function FaturasContainer() {
  const { selectedDate, handleMonthChange, handleYearChange } = useMonthSelection();
  const { 
    faturas, 
    isLoading, 
    gerarFaturas, 
    isGenerating,
    deleteFatura,
    updateFaturaStatus,
    updateFatura 
  } = useFaturas(selectedDate);
  const [faturaToConfirmPayment, setFaturaToConfirmPayment] = useState<Fatura | null>(null);

  const handlePreviousMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    handleMonthChange(newDate.getMonth());
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    handleMonthChange(newDate.getMonth());
  };

  const handleDeleteFatura = async (id: string) => {
    await deleteFatura(id);
  };

  const handleUpdateFaturaStatus = async (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => {
    await updateFaturaStatus({
      id: fatura.id,
      status: newStatus,
      observacao
    });
  };

  const handleUpdateFatura = async (data: UpdateFaturaInput) => {
    await updateFatura(data);
  };

  const handleConfirmPayment = async (data: { 
    id: string; 
    data_pagamento: string; 
    valor_adicional: number; 
    observacao_pagamento: string | null; 
  }) => {
    await updateFaturaStatus({
      id: data.id,
      status: 'paga',
      observacao_pagamento: data.observacao_pagamento,
      data_pagamento: data.data_pagamento,
      valor_adicional: data.valor_adicional
    });
    setFaturaToConfirmPayment(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <FaturasHeader 
        onGerarFaturas={gerarFaturas}
        isGenerating={isGenerating}
      />
      
      <MonthSelector
        currentDate={selectedDate}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
      />
      
      <FaturasTable
        faturas={faturas}
        isLoading={isLoading}
        onDeleteFatura={handleDeleteFatura}
        onUpdateStatus={handleUpdateFaturaStatus}
        onUpdateFatura={handleUpdateFatura}
      />

      {faturaToConfirmPayment && (
        <PaymentConfirmationModal
          fatura={faturaToConfirmPayment}
          isOpen={!!faturaToConfirmPayment}
          onConfirm={handleConfirmPayment}
          onClose={() => setFaturaToConfirmPayment(null)}
        />
      )}
    </div>
  );
}
