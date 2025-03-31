
import { Button } from "@/components/ui/button";
import { MonthSelector } from "@/components/MonthSelector";

interface PagamentosHeaderProps {
  onGerarPagamentos: () => void;
  isGenerating: boolean;
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export function PagamentosHeader({ 
  onGerarPagamentos, 
  isGenerating, 
  currentDate, 
  onPreviousMonth, 
  onNextMonth 
}: PagamentosHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      <h1 className="text-3xl font-bold text-gray-900">Pagamentos</h1>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <MonthSelector
          currentDate={currentDate}
          onPreviousMonth={onPreviousMonth}
          onNextMonth={onNextMonth}
        />
        
        <div className="space-x-2">
          <Button variant="outline">Filtrar</Button>
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={onGerarPagamentos}
            disabled={isGenerating}
          >
            {isGenerating ? "Gerando..." : "Gerar Pagamentos"}
          </Button>
        </div>
      </div>
    </div>
  );
}
