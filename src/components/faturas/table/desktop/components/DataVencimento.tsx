
/**
 * Componente para exibir a data de vencimento
 * 
 * Formata e exibe a data de vencimento da fatura no formato brasileiro.
 */
import { formatDateToPtBR } from "@/utils/dateFormatters";

interface DataVencimentoProps {
  dataVencimento: string;
}

export function DataVencimento({ dataVencimento }: DataVencimentoProps) {
  return <div className="text-right">{formatDateToPtBR(dataVencimento)}</div>;
}
