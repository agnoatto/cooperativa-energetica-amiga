
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MonthSelectorProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export function MonthSelector({ currentDate, onPreviousMonth, onNextMonth }: MonthSelectorProps) {
  // Formatar a data no formato "Mês de Ano"
  const formattedDate = format(currentDate, "MMMM 'de' yyyy", { locale: ptBR });
  
  return (
    <div className="flex items-center justify-center space-x-4 py-4">
      <Button
        variant="outline"
        size="icon"
        onClick={onPreviousMonth}
        aria-label="Mês anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-lg font-medium min-w-40 text-center">
        {formattedDate}
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={onNextMonth}
        aria-label="Próximo mês"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
