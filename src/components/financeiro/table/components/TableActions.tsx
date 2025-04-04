
/**
 * Componente de ações da tabela de lançamentos
 * 
 * Renderiza as ações disponíveis para cada lançamento financeiro,
 * como visualizar detalhes, marcar como pago, ou cancelar.
 */
import { LancamentoFinanceiro } from "@/types/financeiro";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle2, Eye, MoreHorizontal, XCircle } from "lucide-react";

interface TableActionsProps {
  lancamento: LancamentoFinanceiro;
  onViewDetails: (lancamento: LancamentoFinanceiro) => void;
}

export function TableActions({ lancamento, onViewDetails }: TableActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onViewDetails(lancamento)}>
          <Eye className="mr-2 h-4 w-4" />
          Ver detalhes
        </DropdownMenuItem>
        {lancamento.status === 'pendente' && (
          <DropdownMenuItem>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Marcar como pago
          </DropdownMenuItem>
        )}
        {lancamento.status === 'pendente' && (
          <DropdownMenuItem>
            <XCircle className="mr-2 h-4 w-4" />
            Cancelar
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
