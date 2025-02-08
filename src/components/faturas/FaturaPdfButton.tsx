
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { generateFaturaPdf } from "@/utils/generateFaturaPdf";
import { PdfFaturaData } from "@/types/pdf";
import { useState } from "react";

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
      const { doc, fileName } = await generateFaturaPdf(fatura);
      doc.save(fileName);
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
