
import { Fatura, FaturaStatus } from "@/types/fatura";
import { TableCell, TableRow } from "@/components/ui/table";
import { FaturaStatusBadge } from "../FaturaStatusBadge";
import { format } from "date-fns";
import { FaturaRowActions } from "../FaturaRowActions";
import { useState } from "react";

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
      <TableRow key={fatura.id} className="h-9">
        <TableCell className="py-1.5">{fatura.unidade_beneficiaria.numero_uc}</TableCell>
        <TableCell className="font-medium py-1.5">
          {fatura.unidade_beneficiaria.cooperado.nome}
        </TableCell>
        <TableCell className="text-right py-1.5">
          {fatura.consumo_kwh || 0} kWh
        </TableCell>
        <TableCell className="text-right py-1.5">
          {formatCurrency(fatura.valor_assinatura || 0)}
        </TableCell>
        <TableCell className="text-right py-1.5">
          {formatDate(fatura.data_vencimento)}
        </TableCell>
        <TableCell className="text-right py-1.5">
          <FaturaStatusBadge fatura={fatura} />
        </TableCell>
        <TableCell className="py-1.5 w-10">
          <FaturaRowActions
            fatura={fatura}
            onViewDetails={onViewDetails}
            onEdit={onEdit}
            onDelete={onDelete}
            onUpdateStatus={onUpdateStatus}
            onShowPaymentModal={() => setShowPaymentModal(true)}
            onViewPdf={onViewPdf}
          />
        </TableCell>
      </TableRow>
    </>
  );
}
