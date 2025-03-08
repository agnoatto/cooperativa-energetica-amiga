
import { useState } from "react";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { Eye, Trash2, CheckCircle2, RotateCw, Edit, FileText } from "lucide-react";
import { toast } from "sonner";
import { TableActionMenu, TableAction } from "@/components/ui/table-action-menu";

interface FaturaRowActionsProps {
  fatura: Fatura;
  onViewDetails: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onEdit: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
  onShowPaymentModal: () => void;
  onViewPdf?: () => void;
}

export function FaturaRowActions({
  fatura,
  onViewDetails,
  onDelete,
  onEdit,
  onUpdateStatus,
  onShowPaymentModal,
  onViewPdf
}: FaturaRowActionsProps) {
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const handleReenviarFatura = async () => {
    try {
      setIsProcessingAction(true);
      await onUpdateStatus(fatura, 'reenviada', 'Fatura reenviada após correção');
      toast.success('Fatura reenviada com sucesso');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido ao reenviar fatura';
      toast.error(message);
      console.error('Erro detalhado no reenvio:', error);
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Definindo as ações disponíveis
  const actions: TableAction[] = [
    {
      label: "Visualizar",
      icon: Eye,
      onClick: () => onViewDetails(fatura)
    },
    {
      label: "Editar",
      icon: Edit,
      onClick: () => onEdit(fatura)
    }
  ];

  // Adicionar ação de reenvio para faturas corrigidas
  if (fatura.status === 'corrigida') {
    actions.push({
      label: "Reenviar",
      icon: RotateCw,
      onClick: handleReenviarFatura,
      disabled: isProcessingAction
    });
  }

  // Adicionar ação de confirmar pagamento para faturas enviadas, reenviadas ou atrasadas
  if (['enviada', 'reenviada', 'atrasada'].includes(fatura.status)) {
    actions.push({
      label: "Confirmar Pagamento",
      icon: CheckCircle2,
      onClick: onShowPaymentModal,
      disabled: isProcessingAction
    });
  }

  // Adicionar ação de excluir para faturas geradas
  if (fatura.status === 'gerada') {
    actions.push({
      label: "Excluir",
      icon: Trash2,
      onClick: () => onDelete(fatura),
      disabled: isProcessingAction,
      destructive: true
    });
  }

  // Adicionar ação de visualizar PDF se houver arquivo disponível
  if (fatura.arquivo_concessionaria_path && onViewPdf) {
    actions.push({
      label: "Ver PDF",
      icon: FileText,
      onClick: onViewPdf
    });
  }

  return (
    <div className="text-right">
      <TableActionMenu actions={actions} />
    </div>
  );
}
