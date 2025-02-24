
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
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DeletePagamentoDialogProps {
  pagamento: PagamentoData | null;
  onDelete: () => Promise<void>;
  onClose: () => void;
  isDeleting: boolean;
}

export function DeletePagamentoDialog({
  pagamento,
  isDeleting,
  onDelete,
  onClose,
}: DeletePagamentoDialogProps) {
  if (!pagamento) return null;

  return (
    <AlertDialog open={!!pagamento} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir este pagamento? Esta ação não pode ser desfeita.
            <div className="mt-2 p-4 bg-muted rounded-md">
              <p><strong>Usina:</strong> {pagamento.usina.unidade_usina.numero_uc}</p>
              <p><strong>Período:</strong> {pagamento.mes}/{pagamento.ano}</p>
              <p><strong>Valor:</strong> {pagamento.valor_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
