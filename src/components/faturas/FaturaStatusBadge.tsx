
import { FaturaStatus } from "@/types/fatura";

interface FaturaStatusBadgeProps {
  status: FaturaStatus;
}

export function FaturaStatusBadge({ status }: FaturaStatusBadgeProps) {
  const getStatusColor = (status: FaturaStatus) => {
    const colors = {
      gerada: 'bg-gray-100 text-gray-800',
      pendente: 'bg-yellow-100 text-yellow-800',
      enviada: 'bg-blue-100 text-blue-800',
      atrasada: 'bg-red-100 text-red-800',
      paga: 'bg-green-100 text-green-800',
      finalizada: 'bg-purple-100 text-purple-800'
    };
    return colors[status];
  };

  const getStatusLabel = (status: FaturaStatus) => {
    const labels = {
      gerada: 'Gerada',
      pendente: 'Pendente',
      enviada: 'Enviada',
      atrasada: 'Atrasada',
      paga: 'Paga',
      finalizada: 'Finalizada'
    };
    return labels[status];
  };

  return (
    <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(status)}`}>
      {getStatusLabel(status)}
    </span>
  );
}
