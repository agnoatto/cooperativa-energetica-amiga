
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MonthDisplayProps {
  currentDate: Date;
}

export function MonthDisplay({ currentDate }: MonthDisplayProps) {
  return (
    <span className="text-lg font-medium min-w-40 text-center">
      {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
    </span>
  );
}
