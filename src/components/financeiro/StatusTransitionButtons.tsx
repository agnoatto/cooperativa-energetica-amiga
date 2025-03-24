
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
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { LancamentoFinanceiro, StatusLancamento } from "@/types/financeiro";
import { Loader2, CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useUpdateLancamentoStatus } from "@/hooks/lancamentos/useUpdateLancamentoStatus";

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
        toast.success(`Status atualizado para ${getStatusLabel(statusToChange)}`);
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

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar alteração de status</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja alterar o status do lançamento de "{getStatusLabel(lancamento.status)}" para "
              {statusToChange ? getStatusLabel(statusToChange) : ''}"?
              
              {statusToChange === 'pago' && (
                <div className="mt-4 p-4 border rounded-md bg-amber-50 border-amber-200">
                  <p className="text-amber-800 font-medium">Atenção!</p>
                  <p className="text-amber-700">
                    Para registrar pagamentos com valores específicos, use a opção "Registrar Pagamento" 
                    na tela de detalhes do lançamento.
                  </p>
                </div>
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
    </div>
  );
}

// Funções auxiliares para o componente

function getAvailableStatusTransitions(currentStatus: StatusLancamento) {
  switch (currentStatus) {
    case 'pendente':
      return [
        { 
          value: 'pago' as StatusLancamento, 
          label: 'Marcar como Pago', 
          className: 'text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-200',
          icon: <CheckCircle2 className="h-3.5 w-3.5" />
        },
        { 
          value: 'cancelado' as StatusLancamento, 
          label: 'Cancelar', 
          className: 'text-gray-600 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-200',
          icon: <XCircle className="h-3.5 w-3.5" />
        }
      ];
    case 'atrasado':
      return [
        { 
          value: 'pago' as StatusLancamento, 
          label: 'Marcar como Pago', 
          className: 'text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-200',
          icon: <CheckCircle2 className="h-3.5 w-3.5" />
        },
        { 
          value: 'pendente' as StatusLancamento, 
          label: 'Marcar como Pendente', 
          className: 'text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-200',
          icon: <RotateCcw className="h-3.5 w-3.5" />
        },
        { 
          value: 'cancelado' as StatusLancamento, 
          label: 'Cancelar', 
          className: 'text-gray-600 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-200',
          icon: <XCircle className="h-3.5 w-3.5" />
        }
      ];
    case 'pago':
      return [
        { 
          value: 'pendente' as StatusLancamento, 
          label: 'Marcar como Pendente', 
          className: 'text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-200',
          icon: <RotateCcw className="h-3.5 w-3.5" />
        }
      ];
    case 'cancelado':
      return [
        { 
          value: 'pendente' as StatusLancamento, 
          label: 'Reativar', 
          className: 'text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-200',
          icon: <RotateCcw className="h-3.5 w-3.5" />
        }
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

function getStatusLabel(status: StatusLancamento): string {
  const labels = {
    pendente: 'Pendente',
    pago: 'Pago',
    atrasado: 'Atrasado',
    cancelado: 'Cancelado'
  };
  return labels[status] || status;
}
