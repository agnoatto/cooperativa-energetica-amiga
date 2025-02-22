
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PdfFaturaData } from "@/types/pdf";
import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { FaturaPDF } from "./pdf/FaturaPDF";

interface FaturaPdfButtonProps {
  fatura: PdfFaturaData;
}

export function FaturaPdfButton({ fatura }: FaturaPdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const gerarPDF = async () => {
    if (!fatura || !fatura.unidade_beneficiaria) {
      toast.error("Dados da fatura incompletos");
      return;
    }

    setIsGenerating(true);
    try {
      const blob = await pdf(<FaturaPDF fatura={fatura} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `fatura-${fatura.unidade_beneficiaria.numero_uc}-${String(fatura.mes).padStart(2, '0')}-${fatura.ano}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error("Erro ao gerar PDF. Por favor, tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={gerarPDF}
      title="Gerar PDF"
      disabled={isGenerating}
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileText className="h-4 w-4" />
      )}
    </Button>
  );
}
