
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PdfPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string | null;
}

export function PdfPreview({ isOpen, onClose, pdfUrl }: PdfPreviewProps) {
  if (!isOpen) return null;

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
        <div className="flex-1 w-full h-full">
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-full rounded-md"
              title="Visualização da Conta de Energia"
            />
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Não foi possível carregar o arquivo. Verifique se o arquivo existe ou tente novamente mais tarde.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
