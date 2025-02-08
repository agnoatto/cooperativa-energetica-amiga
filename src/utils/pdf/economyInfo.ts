
import { jsPDF } from "jspdf";
import { COLORS, FONTS, SPACING } from "./constants";
import { PdfFaturaData } from "@/types/pdf";

export const addEconomyInfo = (doc: jsPDF, fatura: PdfFaturaData, yPos: number): number => {
  doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text("Economia", SPACING.MARGIN, yPos);
  
  yPos += 15;

  // Box de economia do mês
  doc.setFillColor(COLORS.LIME_GREEN[0], COLORS.LIME_GREEN[1], COLORS.LIME_GREEN[2]);
  const boxWidth = (SPACING.PAGE.WIDTH - (SPACING.MARGIN * 3)) / 2;
  const boxHeight = 40;

  // Economia do mês
  doc.roundedRect(SPACING.MARGIN, yPos, boxWidth, boxHeight, 3, 3, 'F');
  doc.setFontSize(FONTS.SMALL);
  doc.text("Economia neste mês:", SPACING.MARGIN + 5, yPos + 12);
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text(
    formatCurrency(fatura.valor_desconto),
    SPACING.MARGIN + 5,
    yPos + 30
  );

  // Economia acumulada
  doc.roundedRect(
    SPACING.MARGIN * 2 + boxWidth,
    yPos,
    boxWidth,
    boxHeight,
    3,
    3,
    'F'
  );
  doc.setFontSize(FONTS.SMALL);
  doc.text(
    "Economia acumulada:",
    SPACING.MARGIN * 2 + boxWidth + 5,
    yPos + 12
  );
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text(
    formatCurrency(fatura.economia_acumulada),
    SPACING.MARGIN * 2 + boxWidth + 5,
    yPos + 30
  );

  return yPos + boxHeight + 15;
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
