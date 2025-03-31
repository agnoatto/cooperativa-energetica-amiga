
/**
 * Cabeçalho da página de pagamentos
 *
 * Este componente exibe o título da página e as ações principais
 * como gerar pagamentos e visualizar relatórios.
 */
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Filter, Plus } from "lucide-react";
import { RelatorioPagamentosButton } from "./RelatorioPagamentosButton";

interface PagamentosHeaderProps {
  onGerarPagamentos: () => void;
  onOpenRelatorio: () => void;
  isGenerating: boolean;
}

export function PagamentosHeader({ 
  onGerarPagamentos, 
  onOpenRelatorio,
  isGenerating 
}: PagamentosHeaderProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
      <h1 className="text-3xl font-bold text-gray-900">Pagamentos</h1>
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        <Button 
          variant="outline"
          className="flex items-center gap-2"
          size={isMobile ? "icon" : "default"}
        >
          <Filter className="h-4 w-4" />
          {!isMobile && "Filtrar"}
        </Button>
        
        <RelatorioPagamentosButton onClick={onOpenRelatorio} />
        
        <Button 
          className="bg-primary hover:bg-primary/90 ml-auto sm:ml-0"
          onClick={onGerarPagamentos}
          disabled={isGenerating}
        >
          <Plus className="h-4 w-4 mr-2" />
          {isGenerating ? "Gerando..." : "Gerar Pagamentos"}
        </Button>
      </div>
    </div>
  );
}
