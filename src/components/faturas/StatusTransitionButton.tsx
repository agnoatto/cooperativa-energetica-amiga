
/**
 * Botão para transição de status de faturas
 * 
 * Este componente renderiza um botão que permite a transição de status
 * de uma fatura, com aparência personalizada para cada tipo de transição
 * e confirmação antes da ação.
 */
import React, { useState } from "react";
import { FaturaStatus } from "@/types/fatura";
import { transitionButtonColors, transitionActionLabels } from "@/hooks/faturas/utils/statusTransitions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface StatusTransitionButtonProps {
  targetStatus: FaturaStatus;
  currentStatus: FaturaStatus;
  onUpdateStatus: () => Promise<void>;
  disabled?: boolean;
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function StatusTransitionButton({
  targetStatus,
  currentStatus,
  onUpdateStatus,
  disabled = false,
  size = "default",
  className,
}: StatusTransitionButtonProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const buttonColor = transitionButtonColors[targetStatus];
  const actionLabel = transitionActionLabels[targetStatus];

  const getDescription = () => {
    switch (targetStatus) {
      case "pendente":
        return "Isto voltará a fatura para o estado de pendente.";
      case "enviada":
        return "Isto marcará a fatura como enviada ao cliente.";
      case "corrigida":
        return "Isto marcará a fatura para correção.";
      case "reenviada":
        return "Isto marcará a fatura como reenviada após correções.";
      case "atrasada":
        return "Isto marcará a fatura como atrasada.";
      case "paga":
        return "Isto marcará a fatura como paga. Você deve verificar dados adicionais de pagamento.";
      case "finalizada":
        return "Isto finalizará a fatura, encerrando seu ciclo de vida.";
      default:
        return "Tem certeza que deseja alterar o status desta fatura?";
    }
  };

  const handleConfirm = async () => {
    setIsUpdating(true);
    try {
      await onUpdateStatus();
    } finally {
      setIsUpdating(false);
      setShowConfirmation(false);
    }
  };

  // Determinar o tamanho do botão
  const sizeClasses = {
    sm: "text-xs py-1 px-2",
    default: "text-sm py-1.5 px-3",
    lg: "text-base py-2 px-4"
  }[size];

  return (
    <>
      <button
        type="button"
        onClick={() => setShowConfirmation(true)}
        disabled={disabled || isUpdating}
        className={cn(
          "border rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          buttonColor,
          sizeClasses,
          className
        )}
      >
        {isUpdating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          actionLabel
        )}
      </button>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {`Alterar status para ${transitionActionLabels[targetStatus].toLowerCase()}`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {getDescription()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className={cn(buttonVariants({ variant: "default" }), buttonColor)}
              disabled={isUpdating}
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
