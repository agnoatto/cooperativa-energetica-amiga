
/**
 * Componente de diálogo para exclusão de múltiplos arquivos de contas de energia
 * 
 * Este componente permite a exclusão em lote de arquivos de contas de energia
 * anexados a pagamentos de usinas, ajudando na limpeza do sistema.
 */
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFileState } from "./hooks/useFileState";

interface DeleteMultipleFilesDialogProps {
  pagamentoIds: string[];
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export function DeleteMultipleFilesDialog({
  pagamentoIds,
  isOpen,
  onClose,
  onDelete,
}: DeleteMultipleFilesDialogProps) {
  const { deleteMultipleFilesByPagamentoIds, isDeleting } = useFileState();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDelete = async () => {
    setIsProcessing(true);
    try {
      await deleteMultipleFilesByPagamentoIds(pagamentoIds);
      onDelete();
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Excluir arquivos de contas de energia</DialogTitle>
          <DialogDescription>
            Deseja realmente excluir os arquivos de contas de energia dos {pagamentoIds.length} pagamentos selecionados?
            Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isProcessing || isDeleting}
          >
            {isProcessing || isDeleting ? "Excluindo..." : "Excluir arquivos"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
