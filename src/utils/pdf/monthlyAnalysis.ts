
import { jsPDF } from "jspdf";
import { COLORS, FONTS } from "./constants";
import { formatCurrency } from "../pdfUtils";

export const addMonthlyAnalysis = (doc: jsPDF, data: any, yPos: number): number => {
  // Título da seção
  doc.setFillColor(COLORS.LIGHT_GRAY[0], COLORS.LIGHT_GRAY[1], COLORS.LIGHT_GRAY[2]);
  doc.rect(20, yPos, 170, 10, 'F');
  doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text("Análise Mensal", 25, yPos + 7);

  yPos += 20;

  // Coluna da esquerda
  doc.setFontSize(FONTS.NORMAL);
  
  // Box de consumo
  doc.setFillColor(COLORS.LIME_GREEN[0], COLORS.LIME_GREEN[1], COLORS.LIME_GREEN[2]);
  doc.roundedRect(20, yPos, 80, 25, 3, 3, 'F');
  doc.text(`Consumo do mês: ${data.consumo} kWh`, 25, yPos + 15);

  // Economia do mês
  yPos += 35;
  doc.text("Neste mês você economizou:", 20, yPos);
  doc.setFillColor(COLORS.LIME_GREEN[0], COLORS.LIME_GREEN[1], COLORS.LIME_GREEN[2]);
  doc.roundedRect(20, yPos + 5, 80, 25, 3, 3, 'F');
  doc.text(formatCurrency(data.valorFaturaSemCogesol - data.valorFaturaComCogesol), 25, yPos + 20);

  // Economia acumulada
  yPos += 40;
  doc.text("Até agora já economizou:", 20, yPos);
  doc.setFillColor(COLORS.LIME_GREEN[0], COLORS.LIME_GREEN[1], COLORS.LIME_GREEN[2]);
  doc.roundedRect(20, yPos + 5, 80, 25, 3, 3, 'F');
  doc.text(formatCurrency(data.economiaAcumulada), 25, yPos + 20);

  // Coluna da direita - Análise de valores
  let rightColumnY = yPos - 75;

  // Fatura SEM Cogesol
  doc.setTextColor(COLORS.RED[0], COLORS.RED[1], COLORS.RED[2]);
  doc.text("Fatura SEM a Cogesol:", 110, rightColumnY);
  doc.text(formatCurrency(data.valorFaturaSemCogesol), 110, rightColumnY + 10);

  // Fatura COM Cogesol
  rightColumnY += 30;
  doc.setTextColor(COLORS.BLUE[0], COLORS.BLUE[1], COLORS.BLUE[2]);
  doc.text("Fatura COM a Cogesol:", 110, rightColumnY);
  doc.text(`Fatura RGE: ${formatCurrency(data.faturaConcessionaria)}`, 110, rightColumnY + 10);
  doc.text(`Fatura Cogesol: ${formatCurrency(data.valorFaturaComCogesol)}`, 110, rightColumnY + 20);

  return yPos + 70;
};
