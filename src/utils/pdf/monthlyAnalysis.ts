
import { jsPDF } from "jspdf";
import { COLORS, FONTS, SPACING } from "./constants";

interface MonthlyAnalysisData {
  consumo: number;
  valorFaturaSemCogesol: number;
  valorFaturaComCogesol: number;
  economiaAcumulada: number;
  faturaConcessionaria: number;
  iluminacaoPublica: number;
  outrosValores: number;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const addMonthlyAnalysis = (
  doc: jsPDF, 
  data: MonthlyAnalysisData, 
  yPos: number
): number => {
  // Título da seção
  doc.setFillColor(COLORS.DARK_BLUE[0], COLORS.DARK_BLUE[1], COLORS.DARK_BLUE[2]);
  doc.rect(0, yPos, SPACING.PAGE.WIDTH, 12, 'F');
  doc.setTextColor(COLORS.WHITE[0], COLORS.WHITE[1], COLORS.WHITE[2]);
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text("Análise Mensal", SPACING.MARGIN, yPos + 8);

  yPos += 20;

  // Coluna da esquerda
  const leftColumnWidth = SPACING.PAGE.WIDTH / 2 - SPACING.MARGIN;
  
  // Box de consumo
  doc.setFillColor(COLORS.LIME_GREEN[0], COLORS.LIME_GREEN[1], COLORS.LIME_GREEN[2]);
  doc.roundedRect(SPACING.MARGIN, yPos, leftColumnWidth - 10, 30, 3, 3, 'F');
  doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
  doc.setFontSize(FONTS.NORMAL);
  doc.text("Consumo do mês:", SPACING.MARGIN + 5, yPos + 12);
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text(`${data.consumo} kWh`, SPACING.MARGIN + 5, yPos + 25);

  // Coluna da direita
  const rightColumnX = SPACING.PAGE.WIDTH / 2 + 10;

  // Fatura SEM Cogesol
  yPos += 40;
  doc.setTextColor(COLORS.RED[0], COLORS.RED[1], COLORS.RED[2]);
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text("Fatura SEM a Cogesol:", rightColumnX, yPos);
  
  doc.setFontSize(FONTS.NORMAL);
  const semCogesolItems = [
    { label: "Consumo", value: data.valorFaturaSemCogesol },
    { label: "Iluminação", value: data.iluminacaoPublica },
    { label: "Demais não abatido", value: data.outrosValores }
  ];

  semCogesolItems.forEach((item, index) => {
    doc.text(item.label + ":", rightColumnX, yPos + 15 + (index * 8));
    doc.text(formatCurrency(item.value), rightColumnX + 80, yPos + 15 + (index * 8));
  });

  // Fatura COM Cogesol
  yPos += 50;
  doc.setTextColor(COLORS.BLUE[0], COLORS.BLUE[1], COLORS.BLUE[2]);
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text("Fatura COM a Cogesol:", rightColumnX, yPos);
  
  doc.setFontSize(FONTS.NORMAL);
  doc.text("Fatura RGE:", rightColumnX, yPos + 15);
  doc.text(formatCurrency(data.faturaConcessionaria), rightColumnX + 80, yPos + 15);
  
  doc.text("Fatura Cogesol:", rightColumnX, yPos + 23);
  doc.text(formatCurrency(data.valorFaturaComCogesol), rightColumnX + 80, yPos + 23);

  // Economia do mês
  yPos += 40;
  const economiaMensal = data.valorFaturaSemCogesol - 
    (data.valorFaturaComCogesol + data.faturaConcessionaria);

  doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
  doc.text("Economia neste mês:", SPACING.MARGIN, yPos + 15);
  
  doc.setFillColor(COLORS.LIME_GREEN[0], COLORS.LIME_GREEN[1], COLORS.LIME_GREEN[2]);
  doc.roundedRect(SPACING.MARGIN, yPos + 20, leftColumnWidth - 10, 30, 3, 3, 'F');
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text(formatCurrency(economiaMensal), SPACING.MARGIN + 5, yPos + 40);

  // Economia acumulada
  yPos += 60;
  doc.setFontSize(FONTS.NORMAL);
  doc.text("Economia acumulada:", SPACING.MARGIN, yPos + 15);
  
  doc.setFillColor(COLORS.LIME_GREEN[0], COLORS.LIME_GREEN[1], COLORS.LIME_GREEN[2]);
  doc.roundedRect(SPACING.MARGIN, yPos + 20, leftColumnWidth - 10, 30, 3, 3, 'F');
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text(formatCurrency(data.economiaAcumulada), SPACING.MARGIN + 5, yPos + 40);

  return yPos + 60;
};
