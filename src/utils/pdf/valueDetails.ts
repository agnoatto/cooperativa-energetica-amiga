
import { jsPDF } from "jspdf";
import { COLORS, FONTS, SPACING } from "./constants";
import { PdfFaturaData } from "@/types/pdf";

export const addValueDetails = (doc: jsPDF, fatura: PdfFaturaData, yPos: number): number => {
  doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text("Detalhamento de Valores", SPACING.MARGIN, yPos);
  
  yPos += 6;
  doc.setFontSize(FONTS.NORMAL);

  const values = [
    { label: "Valor Total da Fatura:", value: formatCurrency(fatura.total_fatura) },
    { label: "Iluminação Pública:", value: formatCurrency(fatura.iluminacao_publica) },
    { label: "Outros Valores:", value: formatCurrency(fatura.outros_valores) },
    { label: "Valor do Desconto:", value: formatCurrency(fatura.valor_desconto), highlight: true },
    { label: "Conta de Energia:", value: formatCurrency(fatura.fatura_concessionaria) },
    { label: "Valor da Assinatura:", value: formatCurrency(calcularValorAssinatura(fatura)), bold: true }
  ];

  values.forEach((item, index) => {
    const y = yPos + (index * 5);
    
    if (item.highlight) {
      doc.setTextColor(COLORS.GREEN[0], COLORS.GREEN[1], COLORS.GREEN[2]);
    } else {
      doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
    }
    
    if (item.bold) {
      doc.setFont("helvetica", "bold");
    } else {
      doc.setFont("helvetica", "normal");
    }

    doc.text(item.label, SPACING.MARGIN, y);
    doc.text(item.value, SPACING.PAGE.WIDTH - SPACING.MARGIN - doc.getTextWidth(item.value), y);
  });

  return yPos + 35;
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const calcularValorAssinatura = (fatura: PdfFaturaData): number => {
  const baseDesconto = fatura.total_fatura - fatura.iluminacao_publica - fatura.outros_valores;
  const valorAposDesconto = baseDesconto - fatura.valor_desconto;
  return valorAposDesconto - fatura.fatura_concessionaria;
};
