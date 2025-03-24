
/**
 * Diálogo de confirmação de mudança de status para modal
 * 
 * Este componente exibe um diálogo para confirmar a alteração de status
 * de um lançamento financeiro dentro de modais, com mensagens apropriadas
 * para cada tipo de transição.
 */
import React from "react";
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogCancel, 
  AlertDialogAction 
} from "@/components/ui/alert-dialog";
import { StatusLancamento } from "@/types/financeiro";
import { Loader2 } from "lucide-react";
import { getButtonClassForStatus, getStatusLabel } from "../../utils/statusTransition";

interface ModalStatusConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentStatus: StatusLancamento;
  newStatus: StatusLancamento | null;
  onConfirm: () => Promise<void>;
  isProcessing: boolean;
}

export function ModalStatusConfirmationDialog({
  isOpen,
  onOpenChange,
  currentStatus,
  newStatus,
  onConfirm,
  isProcessing
}: ModalStatusConfirmationDialogProps) {
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
            Tem certeza que deseja alterar o status de "{currentStatusLabel}" para "
            {newStatusLabel}"?
            {newStatus === 'pago' && (
              <>
                <br/><br/>
                <strong>Atenção:</strong> Esta ação irá registrar a data de pagamento como hoje.
              </>
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
