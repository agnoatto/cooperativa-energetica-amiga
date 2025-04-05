
/**
 * Componente de ações da tabela de lançamentos
 * 
 * Renderiza as ações disponíveis para cada lançamento financeiro,
 * como visualizar detalhes, registrar pagamento, ou cancelar.
 * Usa Popover em vez de DropdownMenu para melhor performance e estabilidade.
 */
import { LancamentoFinanceiro } from "@/types/financeiro";
import { Button } from "@/components/ui/button";
import { DollarSign, Eye, MoreHorizontal, XCircle } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { useState } from "react";
import { ActionMenuItem } from "./ActionMenuItem";

interface TableActionsProps {
  lancamento: LancamentoFinanceiro;
  onViewDetails: (lancamento: LancamentoFinanceiro) => void;
  onRegistrarPagamento?: (lancamento: LancamentoFinanceiro) => void;
}

export function TableActions({ 
  lancamento, 
  onViewDetails,
  onRegistrarPagamento 
}: TableActionsProps) {
  const [open, setOpen] = useState(false);

  const handleViewDetails = () => {
    onViewDetails(lancamento);
    setOpen(false);
  };

  const handleRegistrarPagamento = () => {
    if (onRegistrarPagamento) {
      onRegistrarPagamento(lancamento);
    } else {
      // Fallback para caso de implementação futura
      onViewDetails(lancamento);
    }
    setOpen(false);
  };

  const handleCancelar = () => {
    // Implementação futura
    console.log("Cancelar lançamento:", lancamento.id);
    setOpen(false);
  };

  return (
    <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" alignOffset={5} className="w-52 p-1">
          <div className="flex flex-col gap-0.5">
            <ActionMenuItem
              icon={<Eye className="h-4 w-4" />}
              label="Ver detalhes"
              onClick={handleViewDetails}
            />
            
            {lancamento.status === 'pendente' && (
              <ActionMenuItem
                icon={<DollarSign className="h-4 w-4" />}
                label="Registrar pagamento"
                onClick={handleRegistrarPagamento}
              />
            )}
            
            {lancamento.status === 'pendente' && (
              <ActionMenuItem
                icon={<XCircle className="h-4 w-4" />}
                label="Cancelar"
                onClick={handleCancelar}
              />
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
