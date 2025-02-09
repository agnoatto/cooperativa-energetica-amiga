
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Download, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface FaturaPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  filePath: string;
}

export function FaturaPreviewModal({
  isOpen,
  onClose,
  fileName,
  filePath,
}: FaturaPreviewModalProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && filePath) {
      loadPdf();
    }
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [isOpen, filePath]);

  const loadPdf = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.storage
        .from('faturas-concessionaria')
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      setPdfUrl(url);
    } catch (error) {
      console.error('Error loading PDF:', error);
      toast.error("Erro ao carregar o PDF. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = fileName || 'fatura-concessionaria.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Visualizar Fatura da Concessionária</DialogTitle>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-12 top-4"
            onClick={handleDownload}
            title="Baixar PDF"
          >
            <Download className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="flex-1 min-h-0 relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-full"
              title="PDF Viewer"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              Erro ao carregar o PDF
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
