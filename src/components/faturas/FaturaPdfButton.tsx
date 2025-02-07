
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { addSectionTitle, addHighlightedValue, addValueBox, addDivider, formatCurrency } from "@/utils/pdfUtils";

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
      doc.setFontSize(24);
      doc.setTextColor(155, 135, 245); // #9b87f5 primary purple
      doc.text("COGESOL", 20, yPos);
      
      yPos += 10;
      addDivider(doc, yPos);
      
      // Informações do Cliente
      yPos += 15;
      doc.setFontSize(12);
      doc.setTextColor(26, 31, 44); // #1A1F2C
      doc.text(`Cliente: ${fatura.unidade_beneficiaria.cooperado.nome}`, 20, yPos);
      yPos += 7;
      if (fatura.unidade_beneficiaria.cooperado.documento) {
        doc.text(`CPF/CNPJ: ${fatura.unidade_beneficiaria.cooperado.documento}`, 20, yPos);
        yPos += 7;
      }
      doc.text(`Endereço: ${fatura.unidade_beneficiaria.endereco}`, 20, yPos);
      
      // Boxes destacados
      yPos += 20;
      addHighlightedValue(doc, "Unidade Consumidora", fatura.unidade_beneficiaria.numero_uc, 20, yPos, 60);
      addHighlightedValue(doc, "Data de Vencimento", format(new Date(fatura.data_vencimento), 'dd/MM/yyyy'), 85, yPos, 60);
      addHighlightedValue(doc, "Valor a Pagar Cogesol", formatCurrency(fatura.valor_total), 150, yPos, 60);

      // Análise Mensal
      yPos += 25;
      addSectionTitle(doc, "Análise Mensal", yPos);
      yPos += 15;
      doc.setFontSize(12);
      doc.text(`Consumo do mês: ${fatura.consumo_kwh} kWh`, 20, yPos);
      yPos += 7;
      doc.text(`Economia do mês: ${formatCurrency(fatura.valor_desconto)}`, 20, yPos);
      
      // Detalhamento da Fatura
      yPos += 20;
      addSectionTitle(doc, "Detalhamento da Fatura", yPos);
      yPos += 15;
      
      // Fatura SEM a Cogesol
      const semCogesolItems = [
        { label: `Consumo (${fatura.consumo_kwh} kWh)`, value: formatCurrency(fatura.total_fatura) },
        { label: "Iluminação Pública", value: formatCurrency(fatura.iluminacao_publica) },
        { label: "Demais valores", value: formatCurrency(fatura.outros_valores) }
      ];
      
      const totalSemCogesol = fatura.total_fatura + fatura.iluminacao_publica + fatura.outros_valores;
      semCogesolItems.push({ label: "Total", value: formatCurrency(totalSemCogesol) });
      
      addValueBox(doc, "Fatura SEM a Cogesol", semCogesolItems, 20, yPos, 80);
      
      // Fatura COM a Cogesol
      const comCogesolItems = [
        { label: "Fatura Concessionária", value: formatCurrency(fatura.fatura_concessionaria) },
        { label: "Fatura Cogesol", value: formatCurrency(fatura.valor_total) }
      ];
      
      const totalComCogesol = fatura.fatura_concessionaria + fatura.valor_total;
      comCogesolItems.push({ label: "Total", value: formatCurrency(totalComCogesol) });
      
      addValueBox(doc, "Fatura COM a Cogesol", comCogesolItems, 110, yPos, 80);

      // Economia
      yPos += 70;
      const economia = totalSemCogesol - totalComCogesol;
      doc.setFillColor(242, 252, 226); // #F2FCE2
      doc.roundedRect(20, yPos - 5, 170, 15, 3, 3, "F");
      doc.setFontSize(14);
      doc.setTextColor(26, 31, 44);
      doc.text(`Sua economia este mês: ${formatCurrency(economia)}`, 25, yPos + 5);

      // Rodapé
      yPos = 240;
      addDivider(doc, yPos);
      yPos += 10;
      
      doc.setFontSize(10);
      doc.setTextColor(26, 31, 44);
      doc.text("COGESOL - Cooperativa de Geração de Energia Solar", 20, yPos);
      yPos += 5;
      doc.text("CNPJ: XX.XXX.XXX/0001-XX", 20, yPos);
      yPos += 5;
      doc.text("Endereço: Rua Example, 123 - Cidade/UF", 20, yPos);
      
      yPos += 10;
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(20, yPos - 5, 170, 20, 2, 2, "F");
      doc.setFontSize(8);
      doc.text("* Lembre-se: você receberá duas faturas este mês. Uma da concessionária e outra da Cogesol.", 25, yPos + 3);
      doc.text("* Os dados de pagamento seguem em anexo.", 25, yPos + 8);

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
