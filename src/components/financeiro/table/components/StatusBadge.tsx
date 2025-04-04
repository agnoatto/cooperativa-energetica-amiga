
/**
 * Componente que exibe um badge indicando o status do lançamento financeiro
 * 
 * Este componente é responsável por mostrar o status de um lançamento financeiro
 * (pendente, pago, atrasado, cancelado) com formatação visual adequada.
 */
import { StatusLancamento } from "@/types/financeiro";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "../../utils/status";

interface StatusBadgeProps {
  status: StatusLancamento;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusClassName = getStatusColor(status);
  
  return (
    <Badge
      variant="outline"
      className={statusClassName}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
