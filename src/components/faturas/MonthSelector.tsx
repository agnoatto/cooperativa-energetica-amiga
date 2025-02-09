
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
    <div className="flex items-center justify-center space-x-2 py-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={onPreviousMonth}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm font-medium min-w-32 text-center">
        {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={onNextMonth}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
