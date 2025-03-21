
/**
 * Container principal para o módulo de faturas
 * 
 * Este componente gerencia o estado e as operações relacionadas às faturas,
 * incluindo a seleção de mês, listagem, edição e alteração de status.
 */
import { useState } from "react";
import { MonthSelector } from "./MonthSelector";
import { FaturasTable } from "./FaturasTable";
import { FaturasHeader } from "./FaturasHeader";
import { useFaturas } from "@/hooks/useFaturas";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { PaymentConfirmationModal } from "./PaymentConfirmationModal";
import { UpdateFaturaInput } from "@/hooks/faturas/types/updateFatura";

interface FaturasContainerProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export function FaturasContainer({ 
  currentDate, 
  onPreviousMonth, 
  onNextMonth 
}: FaturasContainerProps) {
  const { 
    faturas, 
    isLoading, 
    gerarFaturas, 
    isGenerating,
    deleteFatura,
    updateFaturaStatus,
    updateFatura,
    refetch
  } = useFaturas(currentDate);
  
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
    return await updateFatura(data);
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
        currentDate={currentDate}
        onPreviousMonth={onPreviousMonth}
        onNextMonth={onNextMonth}
      />
      
      <FaturasTable
        faturas={faturas}
        isLoading={isLoading}
        onDeleteFatura={handleDeleteFatura}
        onUpdateStatus={handleUpdateFaturaStatus}
        onUpdateFatura={handleUpdateFatura}
        refetchFaturas={refetch}
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
