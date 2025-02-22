
import { Table, TableBody } from "@/components/ui/table";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { FaturasTableHeader } from "../FaturasTableHeader";
import { FaturaDesktopRow } from "./FaturaDesktopRow";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PaymentConfirmationModal } from "../../PaymentConfirmationModal";

interface FaturasDesktopTableProps {
  faturas: Fatura[];
  onViewDetails: (fatura: Fatura) => void;
  onEdit: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
}

export function FaturasDesktopTable({
  faturas,
  onViewDetails,
  onEdit,
  onDelete,
  onUpdateStatus
}: FaturasDesktopTableProps) {
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFatura, setSelectedFatura] = useState<Fatura | null>(null);

  const handlePaymentConfirm = async (paymentData: any) => {
    if (selectedFatura) {
      await onUpdateStatus(
        selectedFatura,
        'paga',
        'Pagamento confirmado' + (paymentData.valor_adicional > 0 ? ' com valor adicional' : '')
      );
      setShowPaymentModal(false);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <FaturasTableHeader />
          <TableBody>
            {faturas.map((fatura) => (
              <FaturaDesktopRow
                key={fatura.id}
                fatura={fatura}
                onViewDetails={onViewDetails}
                onEdit={onEdit}
                onDelete={onDelete}
                onUpdateStatus={onUpdateStatus}
                onShowPaymentModal={() => {
                  setSelectedFatura(fatura);
                  setShowPaymentModal(true);
                }}
                onViewPdf={() => {
                  setPdfUrl(fatura.arquivo_concessionaria_path);
                  setShowPdfModal(true);
                }}
              />
            ))}
          </TableBody>
        </Table>
      </div>

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

      {selectedFatura && (
        <PaymentConfirmationModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          fatura={selectedFatura}
          onConfirm={handlePaymentConfirm}
        />
      )}
    </>
  );
}
