
import { Button } from "@/components/ui/button";
import { 
  Edit, 
  Eye, 
  Trash2, 
  Send, 
  CheckCircle2,
  MoreVertical 
} from "lucide-react";
import { FaturaPdfButton } from "./FaturaPdfButton";
import { Fatura, FaturaStatus } from "@/types/fatura";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useState } from "react";
import { format } from "date-fns";

interface FaturaActionsProps {
  fatura: Fatura;
  onView: (fatura: Fatura) => void;
  onEdit: (fatura: Fatura) => void;
  onSend: (fatura: Fatura) => void;
  onDelete: (id: string) => Promise<void>;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
}

export function FaturaActions({
  fatura,
  onView,
  onEdit,
  onSend,
  onDelete,
  onUpdateStatus
}: FaturaActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const actions = [];

  // Botão de editar disponível para faturas geradas e pendentes
  if (['gerada', 'pendente'].includes(fatura.status)) {
    actions.push({
      label: "Editar",
      icon: Edit,
      onClick: () => onEdit(fatura)
    });
  }

  // Botão de enviar disponível para faturas pendentes
  if (fatura.status === 'pendente') {
    actions.push({
      label: "Enviar",
      icon: Send,
      onClick: () => onSend(fatura)
    });
  }

  // Botão de confirmar pagamento para faturas enviadas ou atrasadas
  if (['enviada', 'atrasada'].includes(fatura.status)) {
    actions.push({
      label: "Confirmar Pagamento",
      icon: CheckCircle2,
      onClick: () => onUpdateStatus(fatura, 'paga', 'Pagamento confirmado pelo cliente')
    });
  }

  // Botão de finalizar para faturas pagas
  if (fatura.status === 'paga') {
    actions.push({
      label: "Finalizar",
      icon: CheckCircle2,
      onClick: () => onUpdateStatus(fatura, 'finalizada', 'Fatura finalizada - pagamento processado')
    });
  }

  // Botão de excluir disponível para faturas geradas e pendentes
  if (['gerada', 'pendente'].includes(fatura.status)) {
    actions.push({
      label: "Excluir",
      icon: Trash2,
      onClick: () => setShowDeleteDialog(true)
    });
  }

  // Adicionar botão de PDF
  actions.push({
    label: "PDF",
    icon: FaturaPdfButton,
    component: <FaturaPdfButton key="pdf" fatura={fatura} />
  });

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {actions.map((action, index) => (
            action.component ? (
              <div key={index} className="px-2 py-1.5">
                {action.component}
              </div>
            ) : (
              <DropdownMenuItem
                key={index}
                onClick={action.onClick}
                className="flex items-center gap-2"
              >
                <action.icon className="h-4 w-4" />
                <span>{action.label}</span>
              </DropdownMenuItem>
            )
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Fatura</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>Você está prestes a excluir a fatura:</p>
              <div className="bg-muted p-4 rounded-md space-y-1 text-sm">
                <p><strong>UC:</strong> {fatura.unidade_beneficiaria.numero_uc}</p>
                <p><strong>Cooperado:</strong> {fatura.unidade_beneficiaria.cooperado.nome}</p>
                <p><strong>Vencimento:</strong> {format(new Date(fatura.data_vencimento), 'dd/MM/yyyy')}</p>
                <p><strong>Valor:</strong> {formatCurrency(fatura.valor_total)}</p>
              </div>
              <p className="text-destructive mt-4">
                Esta ação não pode ser desfeita. A fatura será permanentemente removida do sistema.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                onDelete(fatura.id);
                setShowDeleteDialog(false);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
