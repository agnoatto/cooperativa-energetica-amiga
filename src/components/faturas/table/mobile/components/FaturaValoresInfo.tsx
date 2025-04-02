
/**
 * Componente de informações de valores e datas da fatura
 * 
 * Exibe consumo, valor, datas e arquivo da fatura em um layout
 * organizado para dispositivos móveis.
 */
import { Fatura } from "@/types/fatura";
import { formatDateToPtBR } from "@/utils/dateFormatters";
import { Zap, DollarSign, Calendar, CalendarClock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FaturaValoresInfoProps {
  fatura: Fatura;
  onViewPdf: (fatura: Fatura) => void;
}

export function FaturaValoresInfo({ fatura, onViewPdf }: FaturaValoresInfoProps) {
  // Formatação de valores
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };
  
  return (
    <div className="space-y-3">
      <div className="flex items-center">
        <Zap className="h-4 w-4 text-gray-500 mr-2" />
        <span className="text-sm">{fatura.consumo_kwh || 0} kWh</span>
      </div>
      
      <div className="flex items-center">
        <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
        <span className="text-sm">{formatCurrency(fatura.valor_assinatura || 0)}</span>
      </div>
      
      <div className="flex items-center">
        <Calendar className="h-4 w-4 text-gray-500 mr-2" />
        <span className="text-sm">Vencimento: {formatDateToPtBR(fatura.data_vencimento)}</span>
      </div>
      
      {fatura.data_proxima_leitura && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-green-600">
                <CalendarClock className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm">Próx. Leitura: {formatDateToPtBR(fatura.data_proxima_leitura)}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Leitura programada para esta data</p>
              <p className="text-xs text-gray-500">Esta data foi programada no mês anterior</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      <div className="flex items-center">
        <FileText className="h-4 w-4 text-gray-500 mr-2" />
        {fatura.arquivo_concessionaria_path ? (
          <Button 
            variant="link" 
            className="p-0 h-auto text-primary" 
            onClick={() => onViewPdf(fatura)}
          >
            Ver fatura concessionária
          </Button>
        ) : (
          <span className="text-sm text-gray-400">Arquivo não anexado</span>
        )}
      </div>
    </div>
  );
}
