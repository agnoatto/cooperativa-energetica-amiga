
/**
 * Grupo de botões para transição de status de faturas
 * 
 * Este componente renderiza todos os botões de transição de status
 * disponíveis para uma fatura de acordo com seu status atual.
 */
import React from "react";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { StatusTransitionButton } from "./StatusTransitionButton";
import { getNextAllowedStatuses } from "@/hooks/faturas/utils/statusTransitions";
import { cn } from "@/lib/utils";

interface StatusTransitionButtonsProps {
  fatura: Fatura;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
  size?: "sm" | "default" | "lg";
  direction?: "row" | "column";
  className?: string;
}

export function StatusTransitionButtons({
  fatura,
  onUpdateStatus,
  size = "default",
  direction = "row",
  className
}: StatusTransitionButtonsProps) {
  const currentStatus = fatura.status;
  const nextStatuses = getNextAllowedStatuses(currentStatus);
  
  // Status especial "paga" é tratado em outro local (PaymentConfirmationModal)
  const filteredStatuses = nextStatuses.filter(status => status !== "paga");
  
  if (filteredStatuses.length === 0) {
    return null;
  }

  return (
    <div 
      className={cn(
        direction === "row" ? "flex flex-row flex-wrap gap-2" : "flex flex-col gap-2",
        className
      )}
    >
      {filteredStatuses.map((status) => (
        <StatusTransitionButton
          key={status}
          targetStatus={status}
          currentStatus={currentStatus}
          onUpdateStatus={() => onUpdateStatus(fatura, status, `Status alterado de ${currentStatus} para ${status}`)}
          size={size}
          className={direction === "column" ? "w-full" : ""}
        />
      ))}
    </div>
  );
}
