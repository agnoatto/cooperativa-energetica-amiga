
/**
 * Componente para exibir as ações rápidas disponíveis para uma fatura
 * 
 * Este componente mostra um menu popup com opções de ações disponíveis 
 * para a fatura conforme seu status atual.
 */
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { StatusTransitionButtons } from "@/components/faturas/StatusTransitionButtons";
import { Fatura, FaturaStatus } from "@/types/fatura";

interface AcoesRapidasProps {
  fatura: Fatura;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
}

export function AcoesRapidas({ fatura, onUpdateStatus }: AcoesRapidasProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-7 w-full flex justify-between items-center">
          Ações <ArrowDown className="h-3 w-3 ml-1" />
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
  );
}
