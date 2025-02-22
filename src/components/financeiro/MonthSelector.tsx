
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";

interface MonthSelectorProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export function MonthSelector({ currentDate, onPreviousMonth, onNextMonth }: MonthSelectorProps) {
  const isMobile = useIsMobile();

  return (
    <div className="bg-white p-4 rounded-lg border">
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size={isMobile ? "icon" : "default"}
          onClick={onPreviousMonth}
          className="h-9 w-9"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="min-w-[180px] text-center">
          <span className="text-base sm:text-lg font-medium">
            {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
          </span>
        </div>
        
        <Button
          variant="outline"
          size={isMobile ? "icon" : "default"}
          onClick={onNextMonth}
          className="h-9 w-9"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
