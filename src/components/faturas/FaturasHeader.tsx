
/**
 * Cabeçalho da página de Faturas
 * 
 * Este componente exibe o título da página, o seletor de mês e os botões de ação,
 * incluindo opções para filtrar e gerar novas faturas.
 */
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MonthSelector } from "@/components/MonthSelector";

interface FaturasHeaderProps {
  onGerarFaturas: () => void;
  isGenerating: boolean;
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export function FaturasHeader({ 
  onGerarFaturas, 
  isGenerating,
  currentDate,
  onPreviousMonth,
  onNextMonth
}: FaturasHeaderProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 sm:gap-6">
      <h1 className="text-2xl font-bold text-gray-900">Faturas</h1>
      
      <div className="flex-grow flex justify-center">
        <MonthSelector
          currentDate={currentDate}
          onPreviousMonth={onPreviousMonth}
          onNextMonth={onNextMonth}
          className="w-auto"
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Button
          variant="outline"
          className="w-full sm:w-auto justify-center"
          size={isMobile ? "lg" : "default"}
        >
          <Filter className="h-4 w-4 sm:mr-2" />
          {!isMobile && "Filtrar"}
        </Button>
        <Button 
          className="w-full sm:w-auto justify-center"
          onClick={onGerarFaturas}
          disabled={isGenerating}
          size={isMobile ? "lg" : "default"}
        >
          <Plus className="h-4 w-4 sm:mr-2" />
          {isGenerating ? "Gerando..." : "Gerar Faturas"}
        </Button>
      </div>
    </div>
  );
}
