
/**
 * Componente para exibir a data da próxima leitura programada
 * 
 * Este componente mostra a data da próxima leitura quando disponível,
 * com um tooltip explicando que esta data foi programada no mês anterior.
 */
import { Calendar } from "lucide-react";
import { formatDateToPtBR } from "@/utils/dateFormatters";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProximaLeituraProps {
  dataProximaLeitura: string | null;
}

export function ProximaLeitura({ dataProximaLeitura }: ProximaLeituraProps) {
  if (!dataProximaLeitura) {
    return <span className="text-xs text-gray-400">Não agendada</span>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center text-green-600">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDateToPtBR(dataProximaLeitura)}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>Leitura programada para esta data</p>
          <p className="text-xs text-gray-500">Esta data foi programada no mês anterior</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
