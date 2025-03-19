
/**
 * Botões para transição de status de lançamentos financeiros
 * 
 * Este componente renderiza os botões de ação para alteração de status
 * de lançamentos financeiros (contas a pagar/receber) baseado no status atual.
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { LancamentoFinanceiro, StatusLancamento } from "@/types/financeiro";
import { Loader2 } from "lucide-react";

interface StatusTransitionButtonsProps {
  lancamento: LancamentoFinanceiro;
  onUpdateStatus: (lancamento: LancamentoFinanceiro, newStatus: StatusLancamento) => Promise<void>;
}

export function StatusTransitionButtons({
  lancamento,
  onUpdateStatus
}: StatusTransitionButtonsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [statusToChange, setStatusToChange] = useState<StatusLancamento | null>(null);

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
    setShowConfirmation(true);
  };

  if (availableStatusTransitions.length === 0) {
    return <p className="text-sm text-gray-500">Nenhuma alteração de status disponível.</p>;
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {availableStatusTransitions.map((status) => (
          <Button
            key={status.value}
            variant="outline"
            size="sm"
            onClick={() => handleStatusClick(status.value)}
            className={status.className}
            disabled={isUpdating}
          >
            {status.label}
          </Button>
        ))}
      </div>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar alteração de status</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja alterar o status de "{lancamento.status}" para "
              {statusToChange}"?
              {statusToChange === 'pago' && (
                <>
                  <br/><br/>
                  <strong>Atenção:</strong> Esta ação irá registrar a data de pagamento como hoje.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleStatusChange} 
              disabled={isUpdating}
              className={getButtonClassForStatus(statusToChange as StatusLancamento)}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                "Confirmar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function getAvailableStatusTransitions(currentStatus: StatusLancamento) {
  switch (currentStatus) {
    case 'pendente':
      return [
        { value: 'pago' as StatusLancamento, label: 'Marcar como Pago', className: 'text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-200' },
        { value: 'atrasado' as StatusLancamento, label: 'Marcar como Atrasado', className: 'text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200' },
        { value: 'cancelado' as StatusLancamento, label: 'Cancelar', className: 'text-gray-600 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-200' }
      ];
    case 'atrasado':
      return [
        { value: 'pago' as StatusLancamento, label: 'Marcar como Pago', className: 'text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-200' },
        { value: 'pendente' as StatusLancamento, label: 'Marcar como Pendente', className: 'text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-200' },
        { value: 'cancelado' as StatusLancamento, label: 'Cancelar', className: 'text-gray-600 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-200' }
      ];
    case 'pago':
      return [
        { value: 'pendente' as StatusLancamento, label: 'Marcar como Pendente', className: 'text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-200' }
      ];
    case 'cancelado':
      return [
        { value: 'pendente' as StatusLancamento, label: 'Reativar', className: 'text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-200' }
      ];
    default:
      return [];
  }
}

function getButtonClassForStatus(status: StatusLancamento): string {
  switch (status) {
    case 'pendente':
      return 'bg-yellow-600 text-white hover:bg-yellow-700';
    case 'pago':
      return 'bg-green-600 text-white hover:bg-green-700';
    case 'atrasado':
      return 'bg-red-600 text-white hover:bg-red-700';
    case 'cancelado':
      return 'bg-gray-600 text-white hover:bg-gray-700';
    default:
      return '';
  }
}
