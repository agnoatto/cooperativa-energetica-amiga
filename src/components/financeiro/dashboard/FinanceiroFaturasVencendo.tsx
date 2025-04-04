
/**
 * Componente de Faturas Vencendo
 * 
 * Exibe uma lista das próximas faturas a vencer para facilitar
 * o acompanhamento e a gestão de faturas pendentes.
 */
import { Badge } from "@/components/ui/badge";
import { format, parseISO, addDays, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatarMoeda } from "@/utils/formatters";
import { LinkComponent } from "./components/LinkComponent";

interface Fatura {
  id: string;
  data_vencimento: string;
  total_fatura: number;
  status: string;
  cooperado?: {
    nome: string;
  }
}

interface FinanceiroFaturasVencendoProps {
  faturas: Fatura[];
}

export function FinanceiroFaturasVencendo({ 
  faturas 
}: FinanceiroFaturasVencendoProps) {
  // Faturas vencendo em breve
  const hoje = new Date();
  const dezDiasDepois = addDays(hoje, 10);
  
  // Filtrar faturas pendentes a vencer nos próximos 10 dias
  const faturasVencendo = faturas
    ?.filter(f => 
      f.status === 'pendente' && 
      isBefore(parseISO(f.data_vencimento), dezDiasDepois)
    )
    .sort((a, b) => 
      new Date(a.data_vencimento).getTime() - new Date(b.data_vencimento).getTime()
    )
    .slice(0, 5); // Limitar a 5 itens
  
  if (!faturasVencendo || faturasVencendo.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-gray-500">
        Não há faturas vencendo nos próximos 10 dias
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {faturasVencendo.map((fatura) => (
        <LinkComponent key={fatura.id} href={`/faturas`}>
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="space-y-1">
              <div className="font-medium">
                {fatura.cooperado?.nome || "Cliente"}
              </div>
              <div className="text-sm text-gray-500">
                {format(parseISO(fatura.data_vencimento), "dd 'de' MMM", { locale: ptBR })}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="font-medium text-green-600">
                {formatarMoeda(fatura.total_fatura)}
              </span>
              <Badge variant="outline">Fatura</Badge>
            </div>
          </div>
        </LinkComponent>
      ))}
    </div>
  );
}
