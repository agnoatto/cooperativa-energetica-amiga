
import React from "react";
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
import { PagamentoData } from "./types/pagamento";

interface DeletePagamentoDialogProps {
  pagamento: PagamentoData | null;
  isDeleting: boolean;
  onDelete: () => Promise<void>;
  onClose: () => void;
}

export function DeletePagamentoDialog({
  pagamento,
  isDeleting,
  onDelete,
  onClose,
}: DeletePagamentoDialogProps) {
  return (
    <AlertDialog open={!!pagamento} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Pagamento</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir este pagamento? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isDeleting}
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
