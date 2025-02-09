
import { FaturaStatus } from "@/types/fatura";

interface FaturaStatusBadgeProps {
  status: FaturaStatus;
}

export function FaturaStatusBadge({ status }: FaturaStatusBadgeProps) {
  const getStatusColor = (status: FaturaStatus) => {
    const colors = {
      gerada: 'bg-gray-50 text-gray-600 border-gray-200',
      pendente: 'bg-yellow-50 text-yellow-600 border-yellow-200',
      enviada: 'bg-blue-50 text-blue-600 border-blue-200',
      atrasada: 'bg-red-50 text-red-600 border-red-200',
      paga: 'bg-green-50 text-green-600 border-green-200',
      finalizada: 'bg-purple-50 text-purple-600 border-purple-200'
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
    <span className={`px-2 py-0.5 text-xs border rounded-full inline-flex items-center ${getStatusColor(status)}`}>
      {getStatusLabel(status)}
    </span>
  );
}
