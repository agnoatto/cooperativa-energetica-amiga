
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface PdfPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string | null;
}

export function PdfPreview({ isOpen, onClose, pdfUrl }: PdfPreviewProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Visualização da Conta de Energia</DialogTitle>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        {pdfUrl && (
          <div className="flex-1 w-full h-full">
            <iframe
              src={`${pdfUrl}#toolbar=0`}
              className="w-full h-full rounded-md"
              title="Visualização da Conta de Energia"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
