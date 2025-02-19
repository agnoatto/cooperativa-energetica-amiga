
import { TableCell, TableRow } from "@/components/ui/table";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { useState } from "react";
import { PaymentConfirmationModal } from "../PaymentConfirmationModal";
import { formatDateToPtBR } from "@/utils/dateFormatters";
import { formatarDocumento } from "@/utils/formatters";
import { FaturaStatusBadge } from "./FaturaStatusBadge";
import { FaturaRowActions } from "./FaturaRowActions";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FileText, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

interface FaturaTableRowProps {
  fatura: Fatura;
  onViewDetails: (fatura: Fatura) => void;
  onEdit: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
}

interface PaymentData {
  id: string;
  data_pagamento: string;
  valor_adicional: number;
  observacao_pagamento: string | null;
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
  const isMobile = useIsMobile();

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const handlePaymentConfirm = async (paymentData: PaymentData) => {
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

  if (isMobile) {
    return (
      <div 
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 touch-manipulation"
        onClick={() => onViewDetails(fatura)}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 truncate">
              {fatura.unidade_beneficiaria.cooperado.nome}
            </h3>
            <p className="text-sm text-gray-500">
              {formatarDocumento(fatura.unidade_beneficiaria.cooperado.documento)}
            </p>
          </div>
          <FaturaStatusBadge fatura={fatura} />
        </div>

        <div className="grid grid-cols-2 gap-y-2 text-sm mb-4">
          <div className="text-gray-500">UC:</div>
          <div className="text-right">{fatura.unidade_beneficiaria.numero_uc}</div>
          
          <div className="text-gray-500">Vencimento:</div>
          <div className="text-right">{formatDateToPtBR(fatura.data_vencimento)}</div>
          
          <div className="text-gray-500">Valor:</div>
          <div className="text-right font-medium">{formatCurrency(fatura.valor_assinatura)}</div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex gap-2">
            {fatura.arquivo_concessionaria_path && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewPdf();
                }}
                className="p-2"
              >
                <FileText className="h-4 w-4" />
              </Button>
            )}
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <>
      <TableRow className="border-b hover:bg-gray-50 transition-colors">
        <TableCell>
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">
              {fatura.unidade_beneficiaria.cooperado.nome}
            </span>
            <div className="text-sm text-gray-500 space-x-2">
              <span>{formatarDocumento(fatura.unidade_beneficiaria.cooperado.documento)}</span>
              <span>•</span>
              <span>
                UC: {fatura.unidade_beneficiaria.numero_uc}
                {fatura.unidade_beneficiaria.apelido && (
                  <span className="text-gray-400 ml-1">
                    ({fatura.unidade_beneficiaria.apelido})
                  </span>
                )}
              </span>
            </div>
          </div>
        </TableCell>
        <TableCell className="whitespace-nowrap">{formatDateToPtBR(fatura.data_vencimento)}</TableCell>
        <TableCell className="text-right font-mono whitespace-nowrap">{fatura.consumo_kwh} kWh</TableCell>
        <TableCell className="text-right font-mono whitespace-nowrap">{formatCurrency(fatura.total_fatura)}</TableCell>
        <TableCell className="text-right font-mono whitespace-nowrap">{formatCurrency(fatura.fatura_concessionaria)}</TableCell>
        <TableCell className="text-right font-mono whitespace-nowrap">{fatura.unidade_beneficiaria.percentual_desconto}%</TableCell>
        <TableCell className="text-right font-mono whitespace-nowrap">{formatCurrency(fatura.valor_desconto)}</TableCell>
        <TableCell className="text-right font-mono whitespace-nowrap">
          {formatCurrency(fatura.valor_assinatura)}
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
