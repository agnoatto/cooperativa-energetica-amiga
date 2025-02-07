
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
  return (
    <div className="flex items-center justify-center space-x-4 py-4">
      <Button
        variant="outline"
        size="icon"
        onClick={onPreviousMonth}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-lg font-medium min-w-40 text-center">
        {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={onNextMonth}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
