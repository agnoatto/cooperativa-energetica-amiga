
/**
 * Componente de seleção de mês
 * 
 * Este componente permite navegar entre os meses em formato de seletor.
 * Oferece controle de navegação entre meses com botões de anterior e próximo,
 * exibindo o mês atual formatado em português.
 */
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
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
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex items-center gap-3 sm:gap-4 bg-white rounded-lg border px-3 py-2">
        <Button
          variant="ghost"
          size={isMobile ? "icon" : "sm"}
          onClick={handlePreviousMonth}
          className="h-8 w-8"
          aria-label="Mês anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="min-w-[140px] text-center flex items-center justify-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm sm:text-base font-medium">
            {formattedDate}
          </span>
        </div>
        
        <Button
          variant="ghost"
          size={isMobile ? "icon" : "sm"}
          onClick={handleNextMonth}
          className="h-8 w-8"
          aria-label="Próximo mês"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
