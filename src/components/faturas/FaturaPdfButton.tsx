
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface FaturaPdfButtonProps {
  fatura: {
    consumo_kwh: number;
    valor_total: number;
    status: string;
    data_vencimento: string;
    mes: number;
    ano: number;
    unidade_beneficiaria: {
      numero_uc: string;
      apelido: string | null;
      cooperado: {
        nome: string;
      };
    };
  };
}

export function FaturaPdfButton({ fatura }: FaturaPdfButtonProps) {
  const gerarPDF = () => {
    try {
      const doc = new jsPDF();
      let yPos = 20;

      // Título
      doc.setFontSize(16);
      doc.text("Fatura de Energia", 20, yPos);
      
      // Mês de referência
      doc.setFontSize(12);
      yPos += 20;
      doc.text(
        `Referência: ${format(new Date(fatura.ano, fatura.mes - 1), 'MMMM/yyyy', { locale: ptBR })}`,
        20,
        yPos
      );

      // Dados do cooperado
      yPos += 20;
      doc.setFontSize(14);
      doc.text("Dados do Cliente", 20, yPos);
      doc.setFontSize(12);
      yPos += 10;
      doc.text(`Nome: ${fatura.unidade_beneficiaria.cooperado.nome}`, 20, yPos);
      yPos += 10;
      doc.text(
        `UC: ${fatura.unidade_beneficiaria.numero_uc}${
          fatura.unidade_beneficiaria.apelido ? ` (${fatura.unidade_beneficiaria.apelido})` : ''
        }`,
        20,
        yPos
      );

      // Dados da fatura
      yPos += 20;
      doc.setFontSize(14);
      doc.text("Detalhes da Fatura", 20, yPos);
      doc.setFontSize(12);
      yPos += 10;
      doc.text(`Consumo: ${fatura.consumo_kwh} kWh`, 20, yPos);
      yPos += 10;
      doc.text(
        `Valor Total: ${new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(fatura.valor_total)}`,
        20,
        yPos
      );
      yPos += 10;
      doc.text(`Vencimento: ${format(new Date(fatura.data_vencimento), 'dd/MM/yyyy')}`, 20, yPos);
      yPos += 10;
      doc.text(`Status: ${fatura.status.charAt(0).toUpperCase() + fatura.status.slice(1)}`, 20, yPos);

      // Salvar o PDF
      const fileName = `fatura-${fatura.unidade_beneficiaria.numero_uc}-${fatura.mes}-${fatura.ano}.pdf`;
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
