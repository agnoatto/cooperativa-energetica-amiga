
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { toast } from "sonner";
import { generateFaturaPdf } from "@/utils/generateFaturaPdf";
import { PdfFaturaData } from "@/types/pdf";
import { jsPDF } from "jspdf";

interface FaturaPdfButtonProps {
  fatura: PdfFaturaData;
}

export function FaturaPdfButton({ fatura }: FaturaPdfButtonProps) {
  const gerarPDF = () => {
    try {
      const doc = new jsPDF();
      const fileName = generateFaturaPdf(fatura);
      doc.save(fileName);
      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error("Erro ao gerar PDF");
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={gerarPDF}
      title="Gerar PDF"
    >
      <FileText className="h-4 w-4" />
    </Button>
  );
}
