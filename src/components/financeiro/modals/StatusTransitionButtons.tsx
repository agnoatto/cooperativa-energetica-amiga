
/**
 * Botões para transição de status de lançamentos financeiros
 * 
 * Este componente renderiza os botões de ação para alteração de status
 * de lançamentos financeiros (contas a pagar/receber) baseado no status atual.
 * O status "atrasado" é determinado automaticamente com base na data de vencimento.
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LancamentoFinanceiro, StatusLancamento } from "@/types/financeiro";
import { ModalStatusConfirmationDialog } from "./confirmation/ModalStatusConfirmationDialog";
import { getAvailableStatusTransitions } from "../utils/statusTransition";

interface StatusTransitionButtonsProps {
  lancamento: LancamentoFinanceiro;
  onUpdateStatus: (
    lancamento: LancamentoFinanceiro, 
    newStatus: StatusLancamento, 
    options?: { 
      valorPago?: number;
      valorJuros?: number;
      valorDesconto?: number;
      observacao?: string;
    }
  ) => Promise<void>;
  onRegistrarPagamento: () => void; // Para controle externo do modal
}

export function StatusTransitionButtons({
  lancamento,
  onUpdateStatus,
  onRegistrarPagamento
}: StatusTransitionButtonsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [statusToChange, setStatusToChange] = useState<StatusLancamento | null>(null);

  // Obter os próximos status possíveis com base no status atual
  // Excluindo 'pago' pois agora temos o botão dedicado de registrar pagamento
  const availableStatusTransitions = getAvailableStatusTransitions(lancamento.status)
    .filter(status => status.value !== 'pago');

  const handleStatusChange = async () => {
    if (!statusToChange) return;
    
    setIsUpdating(true);
    try {
      await onUpdateStatus(lancamento, statusToChange);
    } finally {
      setIsUpdating(false);
      setShowConfirmation(false);
    }
  };

  const handleStatusClick = (status: StatusLancamento) => {
    setStatusToChange(status);
    setShowConfirmation(true);
  };

  if (availableStatusTransitions.length === 0 && lancamento.status !== 'pendente' && lancamento.status !== 'atrasado') {
    return <p className="text-sm text-gray-500">Nenhuma alteração de status disponível.</p>;
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {(lancamento.status === 'pendente' || lancamento.status === 'atrasado') && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRegistrarPagamento}
            className="text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-200"
            disabled={isUpdating}
          >
            <DollarIcon className="h-4 w-4 mr-1" />
            Registrar Pagamento
          </Button>
        )}
        
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

      <ModalStatusConfirmationDialog
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

// Ícone do DollarSign para evitar importação adicional
function DollarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  );
}
