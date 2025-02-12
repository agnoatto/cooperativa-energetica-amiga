
import { TableCell, TableRow } from "@/components/ui/table";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { useState } from "react";
import { PaymentConfirmationModal } from "../PaymentConfirmationModal";
import { formatDateToPtBR } from "@/utils/dateFormatters";
import { formatarDocumento } from "@/utils/formatters";
import { FaturaStatusBadge } from "./FaturaStatusBadge";
import { FaturaRowActions } from "./FaturaRowActions";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

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
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

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

  const handleViewPdf = async () => {
    if (!fatura.arquivo_concessionaria_path) return;

    try {
      const { data, error } = await supabase.storage
        .from('faturas_concessionaria')
        .createSignedUrl(fatura.arquivo_concessionaria_path, 60);

      if (error) throw error;

      setPdfUrl(data.signedUrl);
      setShowPdfModal(true);
    } catch (error) {
      console.error('Erro ao obter URL do PDF:', error);
    }
  };

  return (
    <>
      <TableRow className="border-b hover:bg-gray-50 transition-colors">
        <TableCell className="font-medium whitespace-nowrap">{fatura.unidade_beneficiaria.cooperado.nome}</TableCell>
        <TableCell className="whitespace-nowrap">{formatarDocumento(fatura.unidade_beneficiaria.cooperado.documento)}</TableCell>
        <TableCell className="whitespace-nowrap">
          {fatura.unidade_beneficiaria.numero_uc}
          {fatura.unidade_beneficiaria.apelido && (
            <span className="text-gray-500 text-sm ml-1">
              ({fatura.unidade_beneficiaria.apelido})
            </span>
          )}
        </TableCell>
        <TableCell className="whitespace-nowrap">{formatDateToPtBR(fatura.data_vencimento)}</TableCell>
        <TableCell className="text-right font-mono whitespace-nowrap">{fatura.consumo_kwh} kWh</TableCell>
        <TableCell className="text-right font-mono whitespace-nowrap">{formatCurrency(fatura.total_fatura)}</TableCell>
        <TableCell className="text-right font-mono whitespace-nowrap">{formatCurrency(fatura.fatura_concessionaria)}</TableCell>
        <TableCell className="text-right font-mono whitespace-nowrap">{fatura.unidade_beneficiaria.percentual_desconto}%</TableCell>
        <TableCell className="text-right font-mono whitespace-nowrap">{formatCurrency(fatura.valor_desconto)}</TableCell>
        <TableCell className="text-right font-mono whitespace-nowrap">
          {formatCurrency(fatura.valor_total)}
          {fatura.valor_adicional > 0 && (
            <span className="text-yellow-600 text-sm block">
              +{formatCurrency(fatura.valor_adicional)}
            </span>
          )}
        </TableCell>
        <TableCell className="whitespace-nowrap">
          <FaturaStatusBadge fatura={fatura} />
        </TableCell>
        <TableCell className="whitespace-nowrap text-center">
          {fatura.arquivo_concessionaria_path ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleViewPdf}
              title="Visualizar conta de energia"
              className="h-8 w-8"
            >
              <FileText className="h-4 w-4" />
            </Button>
          ) : (
            <span className="text-gray-400 text-sm">-</span>
          )}
        </TableCell>
        <TableCell className="text-right whitespace-nowrap">
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

      <Dialog open={showPdfModal} onOpenChange={setShowPdfModal}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          {pdfUrl && (
            <iframe
              src={`${pdfUrl}#toolbar=0`}
              className="w-full h-[80vh]"
              title="Conta de Energia"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
