
/**
 * Componente de seleção de mês
 * 
 * Este componente permite navegar entre os meses em formato de seletor.
 * Oferece controle de navegação entre meses com botões de anterior e próximo,
 * exibindo o mês atual formatado em português.
 */
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";

interface MonthSelectorProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  className?: string;
}

export function MonthSelector({ 
  currentDate, 
  onPreviousMonth, 
  onNextMonth,
  className = ""
}: MonthSelectorProps) {
  const isMobile = useIsMobile();
  
  // Formatar a data no formato "Mês de Ano"
  const formattedDate = format(currentDate, "MMMM 'de' yyyy", { locale: ptBR });

  // Handlers com log para depuração
  const handlePreviousMonth = () => {
    console.log("Clicou no botão de mês anterior");
    onPreviousMonth();
  };

  const handleNextMonth = () => {
    console.log("Clicou no botão de próximo mês");
    onNextMonth();
  };

  return (
    <div className={`flex items-center justify-center py-4 sm:py-6 ${className}`}>
      <div className="flex items-center gap-3 sm:gap-4">
        <Button
          variant="outline"
          size={isMobile ? "icon" : "default"}
          onClick={handlePreviousMonth}
          className="h-10 w-10 sm:h-9 sm:w-9"
          aria-label="Mês anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="min-w-[140px] text-center">
          <span className="text-base sm:text-lg font-medium">
            {formattedDate}
          </span>
        </div>
        
        <Button
          variant="outline"
          size={isMobile ? "icon" : "default"}
          onClick={handleNextMonth}
          className="h-10 w-10 sm:h-9 sm:w-9"
          aria-label="Próximo mês"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
