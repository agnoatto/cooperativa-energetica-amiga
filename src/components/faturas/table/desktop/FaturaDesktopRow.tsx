
import { Fatura, FaturaStatus } from "@/types/fatura";
import { TableCell, TableRow } from "@/components/ui/table";
import { FaturaStatusBadge } from "../FaturaStatusBadge";
import { format } from "date-fns";
import { useState } from "react";
import { FaturaActionsMenu } from "../FaturaActionsMenu";

interface FaturaDesktopRowProps {
  fatura: Fatura;
  onViewDetails: (fatura: Fatura) => void;
  onEdit: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
  onViewPdf: () => void;
}

export function FaturaDesktopRow({
  fatura,
  onViewDetails,
  onEdit,
  onDelete,
  onUpdateStatus,
  onViewPdf
}: FaturaDesktopRowProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Formatação de valores
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy");
  };

  return (
    <>
      <TableRow key={fatura.id} className="h-9 hover:bg-gray-50">
        <TableCell className="py-1.5 px-3 text-sm">{fatura.unidade_beneficiaria.numero_uc}</TableCell>
        <TableCell className="py-1.5 px-3 text-sm font-medium truncate max-w-[180px]">
          {fatura.unidade_beneficiaria.cooperado.nome}
        </TableCell>
        <TableCell className="py-1.5 px-3 text-sm text-right">
          {fatura.consumo_kwh || 0} kWh
        </TableCell>
        <TableCell className="py-1.5 px-3 text-sm text-right">
          {formatCurrency(fatura.valor_assinatura || 0)}
        </TableCell>
        <TableCell className="py-1.5 px-3 text-sm text-right">
          {formatDate(fatura.data_vencimento)}
        </TableCell>
        <TableCell className="py-1.5 px-3 text-sm text-right">
          <FaturaStatusBadge fatura={fatura} />
        </TableCell>
        <TableCell className="py-1.5 px-3 text-sm w-10">
          <FaturaActionsMenu
            fatura={fatura}
            onViewDetails={onViewDetails}
            onEdit={onEdit}
            onDelete={onDelete}
            onUpdateStatus={onUpdateStatus}
            onShowPaymentModal={() => setShowPaymentModal(true)}
          />
        </TableCell>
      </TableRow>
    </>
  );
}
