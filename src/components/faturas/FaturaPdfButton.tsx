
import { Button } from "@/components/ui/button";
import { FileText, Loader2, Eye, Download } from "lucide-react";
import { toast } from "sonner";
import { PdfFaturaData } from "@/types/pdf";
import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { FaturaPDF } from "./pdf/FaturaPDF";
import { PdfPreview } from "./upload/PdfPreview";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FaturaPdfButtonProps {
  fatura: PdfFaturaData;
}

export function FaturaPdfButton({ fatura }: FaturaPdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const gerarPDFBlob = async () => {
    if (!fatura || !fatura.unidade_beneficiaria) {
      toast.error("Dados da fatura incompletos");
      return null;
    }

    try {
      const blob = await pdf(<FaturaPDF fatura={fatura} />).toBlob();
      return blob;
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error("Erro ao gerar PDF. Por favor, tente novamente.");
      return null;
    }
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const blob = await gerarPDFBlob();
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fatura-${fatura.unidade_beneficiaria.numero_uc}-${String(fatura.mes).padStart(2, '0')}-${fatura.ano}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("PDF baixado com sucesso!");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreview = async () => {
    setIsGenerating(true);
    try {
      const blob = await gerarPDFBlob();
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setIsPreviewOpen(true);
      toast.success("PDF gerado com sucesso!");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClosePreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setIsPreviewOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            disabled={isGenerating}
            title="Opções do PDF"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handlePreview}>
            <Eye className="mr-2 h-4 w-4" />
            Visualizar PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Baixar PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PdfPreview
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        pdfUrl={previewUrl}
      />
    </>
  );
}
