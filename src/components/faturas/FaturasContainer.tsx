
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

  const handleShowPaymentModal = (fatura: Fatura) => {
    setFaturaToConfirmPayment(fatura);
  };

  const handleConfirmPayment = async (faturaId: string, observacao?: string, dataPagamento?: string) => {
    await updateFaturaStatus({
      id: faturaId,
      status: 'paga',
      observacao_pagamento: observacao,
      data_pagamento: dataPagamento
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
        selectedDate={selectedDate}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
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
          onCancel={() => setFaturaToConfirmPayment(null)}
        />
      )}
    </div>
  );
}
