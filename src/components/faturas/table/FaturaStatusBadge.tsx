
import { Fatura } from "@/types/fatura";
import { formatDateToPtBR } from "@/utils/dateFormatters";
import { getStatusColor, getStatusLabel } from "./utils/statusUtils";

interface FaturaStatusBadgeProps {
  fatura: Pick<Fatura, 'status' | 'data_pagamento'>;
}

export function FaturaStatusBadge({ fatura }: FaturaStatusBadgeProps) {
  return (
    <>
      <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(fatura.status)}`}>
        {getStatusLabel(fatura.status)}
      </span>
      {fatura.status === 'paga' && fatura.data_pagamento && (
        <span className="text-gray-500 text-xs block mt-1">
          Pago em: {formatDateToPtBR(fatura.data_pagamento)}
        </span>
      )}
    </>
  );
}
