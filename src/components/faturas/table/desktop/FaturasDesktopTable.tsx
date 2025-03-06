
import { Fatura, FaturaStatus } from "@/types/fatura";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FaturasExcelTable } from "./FaturasExcelTable";

interface FaturasDesktopTableProps {
  faturas: Fatura[];
  onViewDetails: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
  onCriarCobranca?: (fatura: Fatura) => void; // Add this to be consistent
}

export function FaturasDesktopTable({
  faturas,
  onViewDetails,
  onDelete,
  onUpdateStatus,
  onCriarCobranca // Add parameter here
}: FaturasDesktopTableProps) {
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  return (
    <>
      <div className="rounded-md border">
        <FaturasExcelTable
          faturas={faturas}
          onViewDetails={onViewDetails}
          onDelete={onDelete}
          onUpdateStatus={onUpdateStatus}
          onCriarCobranca={onCriarCobranca} // Pass this to ExcelTable
        />
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
    </>
  );
}
