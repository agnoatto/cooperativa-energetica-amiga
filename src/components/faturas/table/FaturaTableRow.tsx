
import { Fatura, FaturaStatus } from "@/types/fatura";
import { useState } from "react";
import { PaymentConfirmationModal } from "../PaymentConfirmationModal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { FaturaMobileCard } from "./mobile/FaturaMobileCard";
import { FaturaDesktopRow } from "./desktop/FaturaDesktopRow";

interface FaturaTableRowProps {
  fatura: Fatura;
  onViewDetails: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onEdit: (fatura: Fatura) => void;
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
  onDelete,
  onEdit,
  onUpdateStatus,
}: FaturaTableRowProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const isMobile = useIsMobile();

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
      <>
        <FaturaMobileCard 
          fatura={fatura}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
          onUpdateStatus={onUpdateStatus}
          onViewPdf={handleViewPdf}
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

  return (
    <>
      <FaturaDesktopRow
        fatura={fatura}
        onViewDetails={onViewDetails}
        onDelete={onDelete}
        onEdit={onEdit}
        onUpdateStatus={onUpdateStatus}
        onViewPdf={handleViewPdf}
      />

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
