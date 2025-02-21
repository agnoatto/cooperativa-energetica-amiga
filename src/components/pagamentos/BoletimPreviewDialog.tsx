
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PDFViewer } from "@react-pdf/renderer";
import { BoletimPDF } from "../pdf/BoletimPDF";
import { PagamentoData } from "./types/pagamento";

interface BoletimPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pagamento: PagamentoData;
}

export function BoletimPreviewDialog({
  isOpen,
  onClose,
  pagamento,
}: BoletimPreviewDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <PDFViewer width="100%" height="100%" className="rounded-lg">
          <BoletimPDF 
            pagamento={pagamento}
          />
        </PDFViewer>
      </DialogContent>
    </Dialog>
  );
}
