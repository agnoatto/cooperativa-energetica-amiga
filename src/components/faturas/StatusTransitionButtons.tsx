
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
      className={`flex ${direction === "row" ? "flex-row space-x-2" : "flex-col space-y-2"} ${className || ""}`}
    >
      {filteredStatuses.map((status) => (
        <StatusTransitionButton
          key={status}
          targetStatus={status}
          currentStatus={currentStatus}
          onUpdateStatus={() => onUpdateStatus(fatura, status, `Status alterado de ${currentStatus} para ${status}`)}
          size={size}
        />
      ))}
    </div>
  );
}
