
/**
 * Componente para exibir o badge de status do cooperado
 * 
 * Este componente renderiza um badge visual que indica se um cooperado está
 * ativo ou inativo, com cores diferentes para cada estado.
 */
import { Badge } from "@/components/ui/badge";

interface CooperadoStatusBadgeProps {
  isInativo: boolean;
}

export function CooperadoStatusBadge({ isInativo }: CooperadoStatusBadgeProps) {
  if (isInativo) {
    return (
      <Badge variant="outline" className="bg-red-50 text-red-600">
        Inativo
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="bg-green-50 text-green-600">
      Ativo
    </Badge>
  );
}
