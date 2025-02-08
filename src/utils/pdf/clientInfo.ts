
import { jsPDF } from "jspdf";
import { COLORS, FONTS, SPACING } from "./constants";
import { PdfFaturaData } from "@/types/pdf";
import { formatarDocumento } from "../formatters";

export const addClientInfo = (doc: jsPDF, fatura: PdfFaturaData, yPos: number): number => {
  doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
  doc.setFontSize(FONTS.NORMAL);

  // Coluna da esquerda
  doc.text("Cliente:", SPACING.MARGIN, yPos);
  doc.text(fatura.unidade_beneficiaria.cooperado.nome, SPACING.MARGIN + 60, yPos);
  
  doc.text("Endereço:", SPACING.MARGIN, yPos + 15);
  doc.text(fatura.unidade_beneficiaria.endereco, SPACING.MARGIN + 60, yPos + 15);

  // Coluna da direita
  doc.text("CPF/CNPJ:", 120, yPos);
  doc.text(formatarDocumento(fatura.unidade_beneficiaria.cooperado.documento || ""), 160, yPos);
  
  doc.text("Cidade:", 120, yPos + 15);
  doc.text("Nonoai/RS", 160, yPos + 15);

  return yPos + 35;
};

export const addHighlightBoxes = (doc: jsPDF, config: {
  uc: string;
  dueDate: string;
  amount: string;
}, yPos: number): number => {
  const boxWidth = 55;
  const boxHeight = 25;
  const spacing = 15;
  const startX = SPACING.MARGIN;

  // Função auxiliar para criar box destacado
  const createHighlightBox = (x: number, label: string, value: string) => {
    doc.setFillColor(COLORS.LIME_GREEN[0], COLORS.LIME_GREEN[1], COLORS.LIME_GREEN[2]);
    doc.roundedRect(x, yPos, boxWidth, boxHeight, 3, 3, 'F');
    
    doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
    doc.setFontSize(FONTS.SMALL);
    doc.text(label, x + 5, yPos + 7);
    
    doc.setFontSize(FONTS.NORMAL);
    doc.text(value, x + 5, yPos + 18);
  };

  createHighlightBox(startX, "Unidade Consumidora:", config.uc);
  createHighlightBox(startX + boxWidth + spacing, "Data de Vencimento:", config.dueDate);
  createHighlightBox(startX + (boxWidth + spacing) * 2, "Valor a Pagar:", config.amount);

  return yPos + boxHeight + 15;
};
