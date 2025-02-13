
import { StatusLancamento } from "@/types/financeiro";

export const getStatusColor = (status: StatusLancamento) => {
  switch (status) {
    case 'pendente':
      return 'bg-yellow-100 text-yellow-800';
    case 'pago':
      return 'bg-green-100 text-green-800';
    case 'atrasado':
      return 'bg-red-100 text-red-800';
    case 'cancelado':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
