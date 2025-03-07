
import { Fatura, FaturaStatus } from "@/types/fatura";
import { FaturaMobileCard } from "./FaturaMobileCard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";

interface FaturasMobileListProps {
  faturas: Fatura[];
  onViewDetails: (fatura: Fatura) => void;
  onEdit: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
}

export function FaturasMobileList({
  faturas,
  onViewDetails,
  onEdit,
  onDelete,
  onUpdateStatus
}: FaturasMobileListProps) {
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {faturas.map((fatura) => (
        <FaturaMobileCard
          key={fatura.id}
          fatura={fatura}
          onViewDetails={onViewDetails}
          onViewPdf={() => {
            setPdfUrl(fatura.arquivo_concessionaria_path);
            setShowPdfModal(true);
          }}
        />
      ))}

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
    </div>
  );
}
