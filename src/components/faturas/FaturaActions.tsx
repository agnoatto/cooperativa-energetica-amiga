
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2, Send, CheckCircle2 } from "lucide-react";
import { FaturaPdfButton } from "./FaturaPdfButton";
import { Fatura, FaturaStatus } from "@/types/fatura";

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
  const actions = [];

  // Botão de visualizar sempre disponível
  actions.push(
    <Button
      key="view"
      variant="outline"
      size="icon"
      onClick={() => onView(fatura)}
      title="Visualizar Detalhes"
    >
      <Eye className="h-4 w-4" />
    </Button>
  );

  // Botão de editar disponível para faturas geradas e pendentes
  if (['gerada', 'pendente'].includes(fatura.status)) {
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

  // Botão de enviar disponível para faturas pendentes
  if (fatura.status === 'pendente') {
    actions.push(
      <Button
        key="send"
        variant="outline"
        size="icon"
        onClick={() => onSend(fatura)}
        title="Enviar Fatura"
      >
        <Send className="h-4 w-4" />
      </Button>
    );
  }

  // Botão de confirmar pagamento para faturas enviadas ou atrasadas
  if (['enviada', 'atrasada'].includes(fatura.status)) {
    actions.push(
      <Button
        key="confirm"
        variant="outline"
        size="icon"
        onClick={() => onUpdateStatus(fatura, 'paga', 'Pagamento confirmado pelo cliente')}
        title="Confirmar Pagamento"
      >
        <CheckCircle2 className="h-4 w-4" />
      </Button>
    );
  }

  // Botão de finalizar para faturas pagas
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

  // Botão de excluir disponível apenas para faturas geradas
  if (fatura.status === 'gerada') {
    actions.push(
      <Button
        key="delete"
        variant="outline"
        size="icon"
        onClick={() => onDelete(fatura.id)}
        title="Excluir Fatura"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    );
  }

  // Botão de PDF sempre disponível
  actions.push(
    <FaturaPdfButton key="pdf" fatura={fatura} />
  );

  return <div className="space-x-2">{actions}</div>;
}
