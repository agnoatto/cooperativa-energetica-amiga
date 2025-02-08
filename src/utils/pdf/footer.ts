
import { jsPDF } from "jspdf";
import { COLORS, FONTS, SPACING } from "./constants";

export const addCompanyFooter = (doc: jsPDF, valorTotal: number, yPos: number): number => {
  // Informações da empresa
  doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
  doc.setFontSize(FONTS.SMALL);
  
  const companyInfo = [
    "Razão Social: COGESOL Cooperativa de Energia Renovável",
    "CNPJ: 00.175.059/0001-00",
    "Rua Julio Golin, 552 - Centro - Nonoai/RS"
  ];

  companyInfo.forEach((info, index) => {
    doc.text(info, SPACING.MARGIN, yPos + (index * 5));
  });

  // Box com valor total
  doc.setFillColor(COLORS.LIME_GREEN[0], COLORS.LIME_GREEN[1], COLORS.LIME_GREEN[2]);
  const boxWidth = 70;
  const boxHeight = 30;
  const boxX = SPACING.PAGE.WIDTH - SPACING.MARGIN - boxWidth;
  
  doc.roundedRect(boxX, yPos - 5, boxWidth, boxHeight, 2, 2, 'F');
  doc.setFontSize(FONTS.SMALL);
  doc.text("Total a pagar:", boxX + 4, yPos + 5);
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text(formatCurrency(valorTotal), boxX + 4, yPos + 20);

  return yPos + 30;
};

export const addPaymentData = (doc: jsPDF, yPos: number): void => {
  // Mensagem em fundo verde
  doc.setFillColor(COLORS.LIME_GREEN[0], COLORS.LIME_GREEN[1], COLORS.LIME_GREEN[2]);
  doc.rect(0, yPos, SPACING.PAGE.WIDTH, 15, 'F');
  
  doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
  doc.setFontSize(FONTS.SMALL);
  doc.text(
    "Deverá ser pago a sua fatura COGESOL e a fatura RGE!", 
    SPACING.MARGIN, 
    yPos + 10
  );
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

