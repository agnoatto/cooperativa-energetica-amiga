
import { FaturaStatus } from "@/types/fatura";

export const getStatusColor = (status: FaturaStatus) => {
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

export const getStatusLabel = (status: FaturaStatus) => {
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
