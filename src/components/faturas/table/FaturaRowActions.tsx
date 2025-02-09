
import { Button } from "@/components/ui/button";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2, Send, CheckCircle2, FileDown } from "lucide-react";

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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onViewDetails(fatura)}>
          <Eye className="mr-2 h-4 w-4" />
          Visualizar Detalhes
        </DropdownMenuItem>

        {['gerada', 'pendente'].includes(fatura.status) && (
          <DropdownMenuItem onClick={() => onEdit(fatura)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar Fatura
          </DropdownMenuItem>
        )}

        {fatura.status === 'pendente' && (
          <DropdownMenuItem 
            onClick={() => onUpdateStatus(fatura, 'enviada', 'Fatura enviada ao cliente')}
          >
            <Send className="mr-2 h-4 w-4" />
            Enviar Fatura
          </DropdownMenuItem>
        )}

        {['enviada', 'atrasada'].includes(fatura.status) && (
          <DropdownMenuItem onClick={onShowPaymentModal}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Confirmar Pagamento
          </DropdownMenuItem>
        )}

        {fatura.status === 'paga' && (
          <DropdownMenuItem 
            onClick={() => onUpdateStatus(fatura, 'finalizada', 'Fatura finalizada - pagamento processado')}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Finalizar Fatura
          </DropdownMenuItem>
        )}

        {fatura.status === 'gerada' && (
          <DropdownMenuItem onClick={() => onDelete(fatura)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir Fatura
          </DropdownMenuItem>
        )}

        <DropdownMenuItem>
          <FileDown className="mr-2 h-4 w-4" />
          Baixar PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
