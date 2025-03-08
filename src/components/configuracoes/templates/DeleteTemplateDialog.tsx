
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
import { CalculoFaturaTemplate } from "@/types/template";

interface DeleteTemplateDialogProps {
  template: CalculoFaturaTemplate;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteTemplateDialog({
  template,
  isOpen,
  onClose,
  onConfirm,
}: DeleteTemplateDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Template</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o template &ldquo;{template.nome}&rdquo;?
            <br /><br />
            Esta ação não pode ser desfeita e o template não poderá mais ser usado para cálculos de faturas.
            <br /><br />
            <strong>Nota:</strong> Templates em uso por unidades beneficiárias não podem ser excluídos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive">
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
