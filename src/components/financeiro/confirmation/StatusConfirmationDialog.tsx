
/**
 * Diálogo de confirmação para alteração de status de lançamentos financeiros
 * 
 * Este componente exibe um diálogo para confirmar a alteração de status
 * de um lançamento financeiro, com estilo e mensagem apropriados para cada
 * tipo de transição.
 */
import React from "react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { StatusLancamento } from "@/types/financeiro";
import { Loader2 } from "lucide-react";
import { getButtonClassForStatus, getStatusLabel } from "../utils/statusTransition";

interface StatusConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentStatus: StatusLancamento;
  newStatus: StatusLancamento | null;
  onConfirm: () => Promise<void>;
  isProcessing: boolean;
}

export function StatusConfirmationDialog({
  isOpen,
  onOpenChange,
  currentStatus,
  newStatus,
  onConfirm,
  isProcessing
}: StatusConfirmationDialogProps) {
  if (!newStatus) return null;

  const currentStatusLabel = getStatusLabel(currentStatus);
  const newStatusLabel = getStatusLabel(newStatus);
  const buttonClassName = getButtonClassForStatus(newStatus);

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar alteração de status</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja alterar o status do lançamento de "{currentStatusLabel}" para "
            {newStatusLabel}"?
            
            {newStatus === 'pago' && (
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
          <AlertDialogCancel disabled={isProcessing}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            disabled={isProcessing}
            className={buttonClassName}
          >
            {isProcessing ? (
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
  );
}
