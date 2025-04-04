
/**
 * Container principal para o módulo de faturas
 * 
 * Este componente gerencia o estado e as operações relacionadas às faturas,
 * incluindo a seleção de mês, listagem, edição e alteração de status.
 * Confirmação de pagamentos foi movida para o módulo Financeiro.
 */
import { useState } from "react";
import { FaturasTable } from "./FaturasTable";
import { FaturasHeader } from "./FaturasHeader";
import { useFaturas } from "@/hooks/useFaturas";
import { Fatura, FaturaStatus } from "@/types/fatura";
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

  return (
    <div className="flex flex-col gap-4">
      <FaturasHeader 
        onGerarFaturas={gerarFaturas}
        isGenerating={isGenerating}
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
    </div>
  );
}
