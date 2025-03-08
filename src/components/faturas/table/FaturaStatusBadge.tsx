
import { Fatura } from "@/types/fatura";
import { formatDateToPtBR } from "@/utils/dateFormatters";
import { getStatusColor, getStatusLabel } from "./utils/statusUtils";

interface FaturaStatusBadgeProps {
  fatura: Pick<Fatura, 'status' | 'data_pagamento'>;
}

export function FaturaStatusBadge({ fatura }: FaturaStatusBadgeProps) {
  return (
    <>
      <span className={`px-1.5 py-0.5 text-xs rounded-full inline-block ${getStatusColor(fatura.status)}`}>
        {getStatusLabel(fatura.status)}
      </span>
      {fatura.status === 'paga' && fatura.data_pagamento && (
        <span className="text-gray-500 text-xs block mt-0.5">
          {formatDateToPtBR(fatura.data_pagamento)}
        </span>
      )}
    </>
  );
}
