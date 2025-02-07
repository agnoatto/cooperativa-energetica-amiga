
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { addSectionTitle, addHighlightedValue, formatCurrency } from "@/utils/pdfUtils";

interface FaturaPdfButtonProps {
  fatura: {
    consumo_kwh: number;
    valor_total: number;
    status: string;
    data_vencimento: string;
    mes: number;
    ano: number;
    fatura_concessionaria: number;
    total_fatura: number;
    iluminacao_publica: number;
    outros_valores: number;
    valor_desconto: number;
    unidade_beneficiaria: {
      numero_uc: string;
      apelido: string | null;
      endereco: string;
      percentual_desconto: number;
      cooperado: {
        nome: string;
        documento: string | null;
      };
    };
  };
}

export function FaturaPdfButton({ fatura }: FaturaPdfButtonProps) {
  const gerarPDF = () => {
    try {
      const doc = new jsPDF();
      let yPos = 20;

      // Cabeçalho com logo
      doc.setFontSize(20);
      doc.setTextColor(25, 64, 175); // bg-blue-700
      doc.text("COGESOL", 20, yPos);
      
      // Informações do Cliente
      yPos += 20;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Cliente: ${fatura.unidade_beneficiaria.cooperado.nome}`, 20, yPos);
      yPos += 7;
      if (fatura.unidade_beneficiaria.cooperado.documento) {
        doc.text(`CPF/CNPJ: ${fatura.unidade_beneficiaria.cooperado.documento}`, 20, yPos);
        yPos += 7;
      }
      doc.text(`Endereço: ${fatura.unidade_beneficiaria.endereco}`, 20, yPos);
      
      // Boxes destacados
      yPos += 15;
      addHighlightedValue(doc, "Unidade Consumidora", fatura.unidade_beneficiaria.numero_uc, 20, yPos);
      addHighlightedValue(doc, "Data de Vencimento", format(new Date(fatura.data_vencimento), 'dd/MM/yyyy'), 85, yPos);
      addHighlightedValue(doc, "Valor a Pagar Cogesol", formatCurrency(fatura.valor_total), 150, yPos);

      // Análise Mensal
      yPos += 20;
      addSectionTitle(doc, "Análise Mensal", yPos);
      yPos += 15;
      doc.setFontSize(12);
      doc.text(`Consumo do mês: ${fatura.consumo_kwh} kWh`, 20, yPos);
      yPos += 7;
      doc.text(`Economia do mês: ${formatCurrency(fatura.valor_desconto)}`, 20, yPos);
      
      // Detalhamento da Fatura
      yPos += 15;
      addSectionTitle(doc, "Detalhamento da Fatura", yPos);
      yPos += 15;
      
      // Fatura SEM a Cogesol
      doc.setFontSize(14);
      doc.text("Fatura SEM a Cogesol", 20, yPos);
      yPos += 10;
      doc.setFontSize(12);
      doc.text(`Consumo (${fatura.consumo_kwh} kWh): ${formatCurrency(fatura.total_fatura)}`, 25, yPos);
      yPos += 7;
      doc.text(`Iluminação Pública: ${formatCurrency(fatura.iluminacao_publica)}`, 25, yPos);
      yPos += 7;
      doc.text(`Demais valores não abatidos: ${formatCurrency(fatura.outros_valores)}`, 25, yPos);
      yPos += 7;
      const totalSemCogesol = fatura.total_fatura + fatura.iluminacao_publica + fatura.outros_valores;
      doc.text(`Total: ${formatCurrency(totalSemCogesol)}`, 25, yPos);
      
      // Fatura COM a Cogesol
      yPos += 15;
      doc.setFontSize(14);
      doc.text("Fatura COM a Cogesol", 20, yPos);
      yPos += 10;
      doc.setFontSize(12);
      doc.text(`Fatura Concessionária: ${formatCurrency(fatura.fatura_concessionaria)}`, 25, yPos);
      yPos += 7;
      doc.text(`Fatura Cogesol: ${formatCurrency(fatura.valor_total)}`, 25, yPos);
      yPos += 7;
      const totalComCogesol = fatura.fatura_concessionaria + fatura.valor_total;
      doc.text(`Total: ${formatCurrency(totalComCogesol)}`, 25, yPos);

      // Economia
      yPos += 15;
      const economia = totalSemCogesol - totalComCogesol;
      doc.setFillColor(163, 230, 53); // bg-lime-400
      doc.rect(20, yPos - 5, 170, 10, "F");
      doc.text(`Sua economia este mês: ${formatCurrency(economia)}`, 25, yPos + 2);

      // Rodapé
      yPos = 250;
      doc.setFontSize(10);
      doc.text("COGESOL - Cooperativa de Geração de Energia Solar", 20, yPos);
      yPos += 5;
      doc.text("CNPJ: XX.XXX.XXX/0001-XX", 20, yPos);
      yPos += 5;
      doc.text("Endereço: Rua Example, 123 - Cidade/UF", 20, yPos);
      yPos += 10;
      doc.setFontSize(8);
      doc.text("* Lembre-se: você receberá duas faturas este mês. Uma da concessionária e outra da Cogesol.", 20, yPos);
      yPos += 5;
      doc.text("* Os dados de pagamento seguem em anexo.", 20, yPos);

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
