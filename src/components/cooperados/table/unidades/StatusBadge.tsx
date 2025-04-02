
/**
 * Componente de badge para status de unidade
 * 
 * Este componente exibe um badge visual que indica se uma unidade está
 * ativa ou desativada, com cores diferentes para cada estado.
 */
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  isActive: boolean;
}

export function StatusBadge({ isActive }: StatusBadgeProps) {
  if (isActive) {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        Ativa
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="bg-gray-100">
      Desativada
    </Badge>
  );
}
