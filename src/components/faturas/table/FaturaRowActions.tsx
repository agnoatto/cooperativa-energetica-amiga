
import { Button } from "@/components/ui/button";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { Edit, Eye, Trash2, Send, CheckCircle2, PenTool, RotateCw } from "lucide-react";
import { FaturaPdfButton } from "../FaturaPdfButton";

interface FaturaRowActionsProps {
  fatura: Fatura;
  onViewDetails: (fatura: Fatura) => void;
  onEdit: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
  onShowPaymentModal: () => void;
}

export function FaturaRowActions({
  fatura,
  onViewDetails,
  onEdit,
  onDelete,
  onUpdateStatus,
  onShowPaymentModal,
}: FaturaRowActionsProps) {
  const actions = [];

  actions.push(
    <Button
      key="view"
      variant="outline"
      size="icon"
      onClick={() => onViewDetails(fatura)}
      title="Visualizar Detalhes"
    >
      <Eye className="h-4 w-4" />
    </Button>
  );

  // Permitir edição em status específicos
  if (['gerada', 'pendente', 'corrigida'].includes(fatura.status)) {
    actions.push(
      <Button
        key="edit"
        variant="outline"
        size="icon"
        onClick={() => onEdit(fatura)}
        title="Editar Fatura"
      >
        <Edit className="h-4 w-4" />
      </Button>
    );
  }

  // Botão de envio inicial ou reenvio
  if (fatura.status === 'pendente') {
    actions.push(
      <Button
        key="send"
        variant="outline"
        size="icon"
        onClick={() => onUpdateStatus(fatura, 'enviada', 'Fatura enviada ao cliente')}
        title="Enviar Fatura"
      >
        <Send className="h-4 w-4" />
      </Button>
    );
  }

  // Botão para iniciar correção
  if (fatura.status === 'enviada') {
    actions.push(
      <Button
        key="correct"
        variant="outline"
        size="icon"
        onClick={() => onUpdateStatus(fatura, 'corrigida', 'Fatura marcada para correção')}
        title="Corrigir Fatura"
      >
        <PenTool className="h-4 w-4" />
      </Button>
    );
  }

  // Botão para reenviar após correção
  if (fatura.status === 'corrigida') {
    actions.push(
      <Button
        key="resend"
        variant="outline"
        size="icon"
        onClick={() => onUpdateStatus(fatura, 'reenviada', 'Fatura reenviada após correção')}
        title="Reenviar Fatura"
      >
        <RotateCw className="h-4 w-4" />
      </Button>
    );
  }

  // Confirmação de pagamento
  if (['enviada', 'reenviada', 'atrasada'].includes(fatura.status)) {
    actions.push(
      <Button
        key="confirm"
        variant="outline"
        size="icon"
        onClick={onShowPaymentModal}
        title="Confirmar Pagamento"
      >
        <CheckCircle2 className="h-4 w-4" />
      </Button>
    );
  }

  // Finalizar fatura
  if (fatura.status === 'paga') {
    actions.push(
      <Button
        key="finish"
        variant="outline"
        size="icon"
        onClick={() => onUpdateStatus(fatura, 'finalizada', 'Fatura finalizada - pagamento processado')}
        title="Finalizar Fatura"
      >
        <CheckCircle2 className="h-4 w-4" />
      </Button>
    );
  }

  // Permitir exclusão apenas de faturas recém geradas
  if (fatura.status === 'gerada') {
    actions.push(
      <Button
        key="delete"
        variant="outline"
        size="icon"
        onClick={() => onDelete(fatura)}
        title="Excluir Fatura"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    );
  }

  actions.push(
    <FaturaPdfButton key="pdf" fatura={fatura} />
  );

  return (
    <div className="text-right space-x-2">
      {actions}
    </div>
  );
}
