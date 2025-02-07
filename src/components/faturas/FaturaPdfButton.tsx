
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
    economia_acumulada: number;
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

      // Adicionar logo
      const logoPath = '/logo-cogesol.png';
      doc.addImage(logoPath, 'PNG', 20, yPos, 40, 15);
      
      // Título do relatório
      yPos += 5;
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(`Relatório Mensal - Ref.: ${format(new Date(fatura.ano, fatura.mes - 1), 'MMMM/yyyy', { locale: ptBR })}`, 70, yPos);
      
      yPos += 15;
      addDivider(doc, yPos);
      
      // Informações do Cliente em duas colunas
      yPos += 15;
      doc.setFontSize(11);
      
      // Coluna da esquerda
      doc.text("Cliente:", 20, yPos);
      doc.setFontSize(10);
      doc.text(fatura.unidade_beneficiaria.cooperado.nome, 20, yPos + 5);
      
      doc.setFontSize(11);
      doc.text("Endereço:", 20, yPos + 15);
      doc.setFontSize(10);
      doc.text(fatura.unidade_beneficiaria.endereco, 20, yPos + 20);
      
      // Coluna da direita
      if (fatura.unidade_beneficiaria.cooperado.documento) {
        doc.setFontSize(11);
        doc.text("CPF/CNPJ:", 120, yPos);
        doc.setFontSize(10);
        doc.text(fatura.unidade_beneficiaria.cooperado.documento, 120, yPos + 5);
      }
      
      // Boxes destacados com fundo verde claro
      yPos += 35;
      const boxBgColor: [number, number, number] = [197, 255, 114];
      
      // Box UC
      doc.setFillColor(boxBgColor[0], boxBgColor[1], boxBgColor[2]);
      doc.roundedRect(20, yPos, 50, 25, 3, 3, 'F');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.text("Unidade Consumidora", 25, yPos + 8);
      doc.setFontSize(12);
      doc.text(fatura.unidade_beneficiaria.numero_uc, 25, yPos + 18);
      
      // Box Vencimento
      doc.setFillColor(boxBgColor[0], boxBgColor[1], boxBgColor[2]);
      doc.roundedRect(80, yPos, 50, 25, 3, 3, 'F');
      doc.setFontSize(9);
      doc.text("Data Vencimento", 85, yPos + 8);
      doc.setFontSize(12);
      doc.text(format(new Date(fatura.data_vencimento), 'dd/MM/yyyy'), 85, yPos + 18);
      
      // Box Valor
      doc.setFillColor(boxBgColor[0], boxBgColor[1], boxBgColor[2]);
      doc.roundedRect(140, yPos, 50, 25, 3, 3, 'F');
      doc.setFontSize(9);
      doc.text("Valor a Pagar", 145, yPos + 8);
      doc.setFontSize(12);
      doc.text(formatCurrency(fatura.valor_total), 145, yPos + 18);
      
      // Análise Mensal em duas colunas
      yPos += 35;
      addSectionTitle(doc, "Análise Mensal", yPos);
      yPos += 10;
      
      // Coluna da esquerda - Consumo e Economia
      doc.setFontSize(10);
      doc.text("Consumo do mês:", 20, yPos);
      doc.text(`${fatura.consumo_kwh} kWh`, 80, yPos);
      
      yPos += 7;
      doc.text("Economia do mês:", 20, yPos);
      doc.text(formatCurrency(fatura.valor_desconto), 80, yPos);
      
      yPos += 7;
      doc.text("Economia acumulada:", 20, yPos);
      doc.text(formatCurrency(fatura.economia_acumulada), 80, yPos);
      
      // Coluna da direita - Fatura sem Cogesol
      yPos -= 14;
      doc.setFontSize(11);
      doc.text("Fatura SEM a Cogesol", 120, yPos);
      yPos += 7;
      
      const tarifa = (fatura.total_fatura - fatura.iluminacao_publica - fatura.outros_valores) / fatura.consumo_kwh;
      
      doc.setFontSize(10);
      doc.text(`Consumo (${fatura.consumo_kwh} kWh x ${formatCurrency(tarifa)})`, 120, yPos);
      doc.text(formatCurrency(fatura.total_fatura), 180, yPos);
      
      yPos += 7;
      doc.text("Iluminação Pública", 120, yPos);
      doc.text(formatCurrency(fatura.iluminacao_publica), 180, yPos);
      
      yPos += 7;
      doc.text("Demais valores", 120, yPos);
      doc.text(formatCurrency(fatura.outros_valores), 180, yPos);
      
      const totalSemCogesol = fatura.total_fatura + fatura.iluminacao_publica + fatura.outros_valores;
      yPos += 7;
      doc.setFont("helvetica", "bold");
      doc.text("Total", 120, yPos);
      doc.text(formatCurrency(totalSemCogesol), 180, yPos);
      doc.setFont("helvetica", "normal");
      
      // Fatura com Cogesol
      yPos += 12;
      doc.setFontSize(11);
      doc.text("Fatura COM a Cogesol", 120, yPos);
      
      yPos += 7;
      doc.setFontSize(10);
      doc.text("Fatura Concessionária", 120, yPos);
      doc.text(formatCurrency(fatura.fatura_concessionaria), 180, yPos);
      
      yPos += 7;
      doc.text("Fatura Cogesol", 120, yPos);
      doc.text(formatCurrency(fatura.valor_total), 180, yPos);
      
      const totalComCogesol = fatura.fatura_concessionaria + fatura.valor_total;
      yPos += 7;
      doc.setFont("helvetica", "bold");
      doc.text("Total", 120, yPos);
      doc.text(formatCurrency(totalComCogesol), 180, yPos);
      doc.setFont("helvetica", "normal");
      
      // Economia final
      yPos += 15;
      const economiaFinal = totalSemCogesol - totalComCogesol;
      doc.setFillColor(boxBgColor[0], boxBgColor[1], boxBgColor[2]);
      doc.roundedRect(120, yPos - 5, 70, 15, 3, 3, 'F');
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(`Economia: ${formatCurrency(economiaFinal)}`, 125, yPos + 5);
      doc.setFont("helvetica", "normal");
      
      // Rodapé
      yPos = 270;
      addDivider(doc, yPos);
      yPos += 10;
      
      doc.setFontSize(8);
      doc.text("COGESOL - Cooperativa de Geração de Energia Solar", 20, yPos);
      yPos += 5;
      doc.text("Endereço: Rua Example, 123 - Cidade/UF", 20, yPos);
      
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
