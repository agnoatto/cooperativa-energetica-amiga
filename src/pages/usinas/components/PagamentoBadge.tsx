
// Este componente apresenta o badge de status do pagamento
// Exibe um indicador visual do status atual do pagamento

import React from "react";
import { Badge } from "@/components/ui/badge";

interface PagamentoBadgeProps {
  status: string;
}

export function PagamentoBadge({ status }: PagamentoBadgeProps) {
  switch (status) {
    case 'pago':
      return (
        <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-100">
          Pago
        </Badge>
      );
    case 'pendente':
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-800 hover:bg-yellow-50">
          Pendente
        </Badge>
      );
    case 'atrasado':
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
          Atrasado
        </Badge>
      );
    case 'cancelado':
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
          Cancelado
        </Badge>
      );
    case 'enviado':
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          Enviado
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">{status}</Badge>
      );
  }
}
