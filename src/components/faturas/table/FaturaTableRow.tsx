
import { TableCell, TableRow } from "@/components/ui/table";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { useState } from "react";
import { PaymentConfirmationModal } from "../PaymentConfirmationModal";
import { formatDateToPtBR } from "@/utils/dateFormatters";
import { formatarDocumento } from "@/utils/formatters";
import { FaturaStatusBadge } from "./FaturaStatusBadge";
import { FaturaRowActions } from "./FaturaRowActions";

interface FaturaTableRowProps {
  fatura: Fatura;
  onViewDetails: (fatura: Fatura) => void;
  onEdit: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
}

export function FaturaTableRow({
  fatura,
  onViewDetails,
  onEdit,
  onDelete,
  onUpdateStatus,
}: FaturaTableRowProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const handlePaymentConfirm = async (paymentData: {
    id: string;
    data_pagamento: string;
    valor_adicional: number;
    observacao_pagamento: string | null;
  }) => {
    await onUpdateStatus(
      fatura,
      'paga',
      'Pagamento confirmado com' + (paymentData.valor_adicional > 0 ? ' valor adicional' : '')
    );
  };

  return (
    <>
      <TableRow className="h-8 hover:bg-gray-50 transition-colors">
        <TableCell className="py-1 font-medium">{fatura.unidade_beneficiaria.cooperado.nome}</TableCell>
        <TableCell className="py-1">{formatarDocumento(fatura.unidade_beneficiaria.cooperado.documento)}</TableCell>
        <TableCell className="py-1">
          {fatura.unidade_beneficiaria.numero_uc}
          {fatura.unidade_beneficiaria.apelido && (
            <span className="text-gray-500 text-xs ml-1">
              ({fatura.unidade_beneficiaria.apelido})
            </span>
          )}
        </TableCell>
        <TableCell className="py-1">{formatDateToPtBR(fatura.data_vencimento)}</TableCell>
        <TableCell className="py-1 text-right font-mono">{fatura.consumo_kwh}</TableCell>
        <TableCell className="py-1 text-right font-mono">{formatCurrency(fatura.total_fatura)}</TableCell>
        <TableCell className="py-1 text-right font-mono">{formatCurrency(fatura.fatura_concessionaria)}</TableCell>
        <TableCell className="py-1 text-right font-mono">{fatura.unidade_beneficiaria.percentual_desconto}%</TableCell>
        <TableCell className="py-1 text-right font-mono">{formatCurrency(fatura.valor_desconto)}</TableCell>
        <TableCell className="py-1 text-right font-mono">
          {formatCurrency(fatura.valor_total)}
          {fatura.valor_adicional > 0 && (
            <span className="text-yellow-600 text-xs block">
              +{formatCurrency(fatura.valor_adicional)}
            </span>
          )}
        </TableCell>
        <TableCell className="py-1">
          <FaturaStatusBadge fatura={fatura} />
        </TableCell>
        <TableCell className="py-1 pr-2">
          <FaturaRowActions
            fatura={fatura}
            onViewDetails={onViewDetails}
            onEdit={onEdit}
            onDelete={onDelete}
            onUpdateStatus={onUpdateStatus}
            onShowPaymentModal={() => setShowPaymentModal(true)}
          />
        </TableCell>
      </TableRow>

      <PaymentConfirmationModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        fatura={fatura}
        onConfirm={handlePaymentConfirm}
      />
    </>
  );
}
