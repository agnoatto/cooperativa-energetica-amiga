
import { jsPDF } from "jspdf";
import { COLORS, FONTS, SPACING } from "./constants";
import { PdfFaturaData } from "@/types/pdf";

export const addEconomyInfo = (doc: jsPDF, fatura: PdfFaturaData, yPos: number): number => {
  doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text("Economia", SPACING.MARGIN, yPos);
  
  yPos += 8;

  // Box de economia do mês
  doc.setFillColor(COLORS.LIME_GREEN[0], COLORS.LIME_GREEN[1], COLORS.LIME_GREEN[2]);
  const boxWidth = (SPACING.PAGE.CONTENT_WIDTH - 5) / 2;
  const boxHeight = 25;

  // Economia do mês
  doc.roundedRect(SPACING.MARGIN, yPos, boxWidth, boxHeight, 2, 2, 'F');
  doc.setFontSize(FONTS.SMALL);
  doc.text("Economia neste mês:", SPACING.MARGIN + 4, yPos + 7);
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text(
    formatCurrency(fatura.valor_desconto),
    SPACING.MARGIN + 4,
    yPos + 18
  );

  // Economia acumulada
  doc.roundedRect(
    SPACING.MARGIN + boxWidth + 5,
    yPos,
    boxWidth,
    boxHeight,
    2,
    2,
    'F'
  );
  doc.setFontSize(FONTS.SMALL);
  doc.text(
    "Economia acumulada:",
    SPACING.MARGIN + boxWidth + 9,
    yPos + 7
  );
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text(
    formatCurrency(fatura.economia_acumulada),
    SPACING.MARGIN + boxWidth + 9,
    yPos + 18
  );

  return yPos + boxHeight + 8;
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
