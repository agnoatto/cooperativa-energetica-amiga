
/**
 * Componente para exibição de badge de status da fatura
 * 
 * Este componente renderiza um badge visual que indica o status atual
 * da fatura, usando cores diferentes para cada estado possível.
 */
import { Fatura } from "@/types/fatura";
import { Badge } from "@/components/ui/badge";

interface FaturaStatusBadgeProps {
  fatura: Fatura;
}

export function FaturaStatusBadge({ fatura }: FaturaStatusBadgeProps) {
  const getStatusStyle = () => {
    switch (fatura.status) {
      case 'pendente':
        return "bg-yellow-50 text-yellow-800 border-yellow-200";
      case 'enviada':
        return "bg-blue-50 text-blue-800 border-blue-200";
      case 'reenviada':
        return "bg-indigo-50 text-indigo-800 border-indigo-200";
      case 'corrigida':
        return "bg-purple-50 text-purple-800 border-purple-200";
      case 'atrasada':
        return "bg-red-50 text-red-700 border-red-200";
      case 'paga':
        return "bg-green-50 text-green-800 border-green-200";
      case 'finalizada':
        return "bg-gray-50 text-gray-800 border-gray-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getStatusLabel = () => {
    const map: Record<string, string> = {
      'pendente': 'Pendente',
      'enviada': 'Enviada',
      'reenviada': 'Reenviada',
      'corrigida': 'Corrigida',
      'atrasada': 'Atrasada',
      'paga': 'Paga',
      'finalizada': 'Finalizada'
    };
    return map[fatura.status] || fatura.status;
  };

  return (
    <div className="flex justify-end">
      <Badge variant="outline" className={`${getStatusStyle()} font-medium text-xs py-1 px-2`}>
        {getStatusLabel()}
      </Badge>
    </div>
  );
}
