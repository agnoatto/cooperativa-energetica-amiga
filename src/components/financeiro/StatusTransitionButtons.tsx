
/**
 * Botões para transição de status de lançamentos financeiros
 * 
 * Este componente renderiza botões que permitem a transição entre diferentes status
 * de lançamentos financeiros (contas a receber/pagar), seguindo o fluxo definido
 * para cada tipo de transição. A opção de marcar como atrasado foi removida, pois
 * esse status é determinado automaticamente pela data de vencimento.
 */
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { LancamentoFinanceiro, StatusLancamento } from "@/types/financeiro";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useUpdateLancamentoStatus } from "@/hooks/lancamentos/useUpdateLancamentoStatus";
import { getAvailableStatusTransitions } from "./utils/statusTransition";
import { StatusConfirmationDialog } from "./confirmation/StatusConfirmationDialog";

interface StatusTransitionButtonsProps {
  lancamento: LancamentoFinanceiro;
  onAfterStatusChange?: () => void;
  className?: string;
}

export function StatusTransitionButtons({
  lancamento,
  onAfterStatusChange,
  className
}: StatusTransitionButtonsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [statusToChange, setStatusToChange] = useState<StatusLancamento | null>(null);
  const { updateLancamentoStatus } = useUpdateLancamentoStatus();

  // Obter os próximos status possíveis com base no status atual
  const availableStatusTransitions = getAvailableStatusTransitions(lancamento.status);

  const handleStatusChange = async () => {
    if (!statusToChange) return;
    
    setIsUpdating(true);
    try {
      const success = await updateLancamentoStatus(lancamento, statusToChange);
      
      if (success) {
        toast.success(`Status atualizado para ${statusToChange}`);
        if (onAfterStatusChange) {
          onAfterStatusChange();
        }
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Ocorreu um erro ao atualizar o status");
    } finally {
      setIsUpdating(false);
      setShowConfirmation(false);
    }
  };

  const handleStatusClick = (status: StatusLancamento) => {
    setStatusToChange(status);
    setShowConfirmation(true);
  };

  if (availableStatusTransitions.length === 0) {
    return null;
  }

  return (
    <>
      <div className={cn("flex flex-wrap gap-2", className)}>
        {availableStatusTransitions.map((status) => (
          <Button
            key={status.value}
            variant="outline"
            size="sm"
            onClick={() => handleStatusClick(status.value)}
            className={status.className}
            disabled={isUpdating}
          >
            {status.icon}
            <span className="ml-1">{status.label}</span>
          </Button>
        ))}
      </div>

      <StatusConfirmationDialog
        isOpen={showConfirmation}
        onOpenChange={setShowConfirmation}
        currentStatus={lancamento.status}
        newStatus={statusToChange}
        onConfirm={handleStatusChange}
        isProcessing={isUpdating}
      />
    </>
  );
}
