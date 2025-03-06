
import { Button } from "@/components/ui/button";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { Eye, CreditCard, Trash2 } from "lucide-react";
import { FaturaPdfButton } from "../FaturaPdfButton";

interface FaturaRowActionsProps {
  fatura: Fatura;
  onViewDetails: (fatura: Fatura) => void;
  onCriarCobranca?: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
}

export function FaturaRowActions({
  fatura,
  onViewDetails,
  onCriarCobranca,
  onDelete,
  onUpdateStatus,
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

  if (['gerada', 'pendente', 'corrigida'].includes(fatura.status) && onCriarCobranca) {
    actions.push(
      <Button
        key="cobranca"
        variant="outline"
        size="icon"
        onClick={() => onCriarCobranca(fatura)}
        title="Criar Cobrança"
      >
        <CreditCard className="h-4 w-4" />
      </Button>
    );
  }

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
