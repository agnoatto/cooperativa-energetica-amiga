
import { jsPDF } from "jspdf";
import { COLORS, FONTS, SPACING } from "./constants";
import { formatCurrency } from "../pdfUtils";

export const addMonthlyAnalysis = (doc: jsPDF, data: {
  consumo: number;
  valorFaturaSemCogesol: number;
  valorFaturaComCogesol: number;
  economiaAcumulada: number;
  faturaConcessionaria: number;
}, yPos: number): number => {
  // Título da seção
  doc.setFillColor(COLORS.LIGHT_GRAY[0], COLORS.LIGHT_GRAY[1], COLORS.LIGHT_GRAY[2]);
  doc.rect(SPACING.MARGIN, yPos, 170, 10, 'F');
  doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text("Análise Mensal", SPACING.MARGIN + 5, yPos + 7);

  yPos += 20;

  // Box de consumo
  doc.setFillColor(COLORS.LIME_GREEN[0], COLORS.LIME_GREEN[1], COLORS.LIME_GREEN[2]);
  doc.roundedRect(SPACING.MARGIN, yPos, 170, 25, 3, 3, 'F');
  doc.text(`Consumo do mês: ${data.consumo} kWh`, SPACING.MARGIN + 5, yPos + 15);

  // Valores das faturas
  yPos += 35;
  
  // Fatura SEM Cogesol
  doc.setTextColor(COLORS.RED[0], COLORS.RED[1], COLORS.RED[2]);
  doc.text("Fatura SEM a Cogesol:", SPACING.MARGIN, yPos);
  doc.text(formatCurrency(data.valorFaturaSemCogesol), SPACING.MARGIN, yPos + 10);

  // Fatura COM Cogesol
  yPos += 30;
  doc.setTextColor(COLORS.BLUE[0], COLORS.BLUE[1], COLORS.BLUE[2]);
  doc.text("Fatura COM a Cogesol:", SPACING.MARGIN, yPos);
  doc.text(`Fatura RGE: ${formatCurrency(data.faturaConcessionaria)}`, SPACING.MARGIN, yPos + 10);
  doc.text(`Fatura Cogesol: ${formatCurrency(data.valorFaturaComCogesol)}`, SPACING.MARGIN, yPos + 20);

  // Economia mensal
  yPos += 40;
  doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
  doc.text("Neste mês você economizou:", SPACING.MARGIN, yPos);
  doc.setFillColor(COLORS.LIME_GREEN[0], COLORS.LIME_GREEN[1], COLORS.LIME_GREEN[2]);
  doc.roundedRect(SPACING.MARGIN, yPos + 5, 170, 25, 3, 3, 'F');
  doc.text(formatCurrency(data.valorFaturaSemCogesol - data.valorFaturaComCogesol), SPACING.MARGIN + 5, yPos + 20);

  // Economia acumulada
  yPos += 40;
  doc.text("Até agora já economizou:", SPACING.MARGIN, yPos);
  doc.setFillColor(COLORS.LIME_GREEN[0], COLORS.LIME_GREEN[1], COLORS.LIME_GREEN[2]);
  doc.roundedRect(SPACING.MARGIN, yPos + 5, 170, 25, 3, 3, 'F');
  doc.text(formatCurrency(data.economiaAcumulada), SPACING.MARGIN + 5, yPos + 20);

  return yPos + 70;
};
