
/**
 * Botões para transição de status de lançamentos financeiros
 * 
 * Este componente renderiza os botões de ação para alteração de status
 * de lançamentos financeiros (contas a pagar/receber) baseado no status atual.
 * Inclui botão para registrar pagamento com valores específicos.
 * O status "atrasado" é determinado automaticamente com base na data de vencimento.
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LancamentoFinanceiro, StatusLancamento } from "@/types/financeiro";
import { RegistrarPagamentoModal } from "./RegistrarPagamentoModal";
import { ModalStatusConfirmationDialog } from "./confirmation/ModalStatusConfirmationDialog";
import { RegistrarPagamentoButton } from "./buttons/RegistrarPagamentoButton";
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
  onRegistrarPagamento?: () => void; // Para permitir controle externo do modal
}

export function StatusTransitionButtons({
  lancamento,
  onUpdateStatus,
  onRegistrarPagamento
}: StatusTransitionButtonsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [statusToChange, setStatusToChange] = useState<StatusLancamento | null>(null);
  const [showPagamentoModal, setShowPagamentoModal] = useState(false);

  // Obter os próximos status possíveis com base no status atual
  const availableStatusTransitions = getAvailableStatusTransitions(lancamento.status);

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
    
    // Se o status for "pago", mostrar modal de pagamento
    if (status === 'pago') {
      // Se houver um handler externo para abrir o modal de pagamento, use-o
      if (onRegistrarPagamento) {
        onRegistrarPagamento();
      } else {
        setShowPagamentoModal(true);
      }
    } else {
      setShowConfirmation(true);
    }
  };

  const handleRegistrarPagamento = async (
    valorPago: number,
    valorJuros: number,
    valorDesconto: number,
    dataPagamento: string,
    observacao: string
  ) => {
    setIsUpdating(true);
    try {
      await onUpdateStatus(lancamento, 'pago', {
        valorPago,
        valorJuros,
        valorDesconto,
        observacao
      });
    } finally {
      setIsUpdating(false);
      setShowPagamentoModal(false);
    }
  };

  if (availableStatusTransitions.length === 0) {
    return <p className="text-sm text-gray-500">Nenhuma alteração de status disponível.</p>;
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {lancamento.status !== 'pago' && (
          <RegistrarPagamentoButton 
            onClick={() => handleStatusClick('pago')}
            disabled={isUpdating}
          />
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

      {/* Renderizar modal de registro de pagamento apenas se não estiver sendo controlado externamente */}
      {!onRegistrarPagamento && (
        <RegistrarPagamentoModal
          lancamento={lancamento}
          isOpen={showPagamentoModal}
          onClose={() => setShowPagamentoModal(false)}
          onConfirm={handleRegistrarPagamento}
        />
      )}
    </>
  );
}
