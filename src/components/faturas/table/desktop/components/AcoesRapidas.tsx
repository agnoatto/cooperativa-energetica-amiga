
/**
 * Componente para exibir as ações rápidas disponíveis para uma fatura
 * 
 * Este componente mostra um menu popup com opções de ações disponíveis 
 * para a fatura conforme seu status atual.
 */
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronDown, Eye, Pencil } from "lucide-react";
import { StatusTransitionButtons } from "@/components/faturas/StatusTransitionButtons";
import { Fatura, FaturaStatus } from "@/types/fatura";

interface AcoesRapidasProps {
  fatura: Fatura;
  onViewDetails: (fatura: Fatura) => void;
  onEdit: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
}

export function AcoesRapidas({ 
  fatura, 
  onUpdateStatus, 
  onViewDetails, 
  onEdit 
}: AcoesRapidasProps) {
  // Determinar quais ações exibir com base no status da fatura
  const showQuickView = ['enviada', 'reenviada', 'atrasada', 'paga'].includes(fatura.status);
  const showQuickEdit = ['pendente', 'corrigida'].includes(fatura.status);
  const showStatusActions = ['enviada', 'reenviada', 'atrasada'].includes(fatura.status);

  return (
    <div className="flex items-center justify-end gap-2">
      {/* Botão de visualização rápida */}
      {showQuickView && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 w-7 p-0"
          onClick={() => onViewDetails(fatura)}
        >
          <Eye className="h-3.5 w-3.5" />
        </Button>
      )}
      
      {/* Botão de edição rápida */}
      {showQuickEdit && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 w-7 p-0"
          onClick={() => onEdit(fatura)}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      )}
      
      {/* Menu de ações de status */}
      {showStatusActions && (
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 px-2 flex justify-between items-center gap-1 bg-white">
              <CheckCircle className="h-3.5 w-3.5" />
              <ChevronDown className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-2 w-fit" align="end">
            <StatusTransitionButtons 
              fatura={fatura} 
              onUpdateStatus={onUpdateStatus} 
              size="sm"
              direction="column"
              className="w-full"
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
