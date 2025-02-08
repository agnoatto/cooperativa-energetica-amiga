
import { jsPDF } from "jspdf";
import { COLORS, FONTS } from "./constants";
import { formatCurrency } from "../pdfUtils";

export const addCompanyFooter = (doc: jsPDF, valorTotal: number, yPos: number): number => {
  // Informações da empresa
  doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
  doc.setFontSize(FONTS.NORMAL);
  
  const companyInfo = [
    "COGESOL - Cooperativa de Geração de Energia Solar",
    "CNPJ: 00.175.059/0001-00",
    "Rua Julio Golin, 552 - Centro - Nonoai/RS"
  ];

  companyInfo.forEach((info, index) => {
    doc.text(info, 20, yPos + (index * 7));
  });

  // Box com valor total
  doc.setFillColor(COLORS.LIME_GREEN[0], COLORS.LIME_GREEN[1], COLORS.LIME_GREEN[2]);
  doc.roundedRect(120, yPos - 5, 70, 35, 3, 3, 'F');
  doc.text("Total a pagar:", 125, yPos + 8);
  doc.setFontSize(FONTS.TITLE);
  doc.text(formatCurrency(valorTotal), 125, yPos + 25);

  return yPos + 40;
};

export const addPaymentData = (doc: jsPDF, yPos: number): void => {
  // Barra verde com mensagem
  doc.setFillColor(COLORS.LIME_GREEN[0], COLORS.LIME_GREEN[1], COLORS.LIME_GREEN[2]);
  doc.rect(0, yPos, 210, 20, 'F');
  doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
  doc.setFontSize(FONTS.NORMAL);
  doc.text("Deverá ser pago a sua fatura COGESOL e a fatura RGE!", 20, yPos + 13);

  // Barra azul com dados de pagamento
  yPos += 20;
  doc.setFillColor(COLORS.DARK_BLUE[0], COLORS.DARK_BLUE[1], COLORS.DARK_BLUE[2]);
  doc.rect(0, yPos, 210, 20, 'F');
  doc.setTextColor(COLORS.WHITE[0], COLORS.WHITE[1], COLORS.WHITE[2]);
  doc.text("Dados de Pagamento Em Anexo", 20, yPos + 13);
};
