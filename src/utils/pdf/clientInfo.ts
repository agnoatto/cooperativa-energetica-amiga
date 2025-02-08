
import { jsPDF } from "jspdf";
import { COLORS, FONTS, SPACING } from "./constants";
import { PdfFaturaData } from "@/types/pdf";
import { formatarDocumento } from "../formatters";

export const addClientInfo = (doc: jsPDF, fatura: PdfFaturaData, yPos: number): number => {
  doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
  doc.setFontSize(FONTS.NORMAL);

  // Coluna da esquerda
  doc.text("Cliente:", SPACING.MARGIN, yPos);
  doc.text(fatura.unidade_beneficiaria.cooperado.nome, SPACING.MARGIN, yPos + 7);
  doc.text("Endereço:", SPACING.MARGIN, yPos + 20);
  doc.text(fatura.unidade_beneficiaria.endereco, SPACING.MARGIN, yPos + 27);

  // Coluna da direita
  doc.text("CPF/CNPJ:", 120, yPos);
  doc.text(formatarDocumento(fatura.unidade_beneficiaria.cooperado.documento || ""), 120, yPos + 7);
  doc.text("Cidade:", 120, yPos + 20);
  doc.text("Cidade", 120, yPos + 27);

  return yPos + 40;
};

export const addHighlightBoxes = (doc: jsPDF, config: {
  uc: string;
  dueDate: string;
  amount: string;
}, yPos: number): number => {
  const boxWidth = 55;
  const boxHeight = 35;
  const spacing = 15;
  const startX = SPACING.MARGIN;

  // Função auxiliar para criar box destacado
  const createHighlightBox = (x: number, label: string, value: string) => {
    doc.setFillColor(COLORS.LIME_GREEN[0], COLORS.LIME_GREEN[1], COLORS.LIME_GREEN[2]);
    doc.roundedRect(x, yPos, boxWidth, boxHeight, 3, 3, 'F');
    
    doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
    doc.setFontSize(FONTS.SMALL);
    doc.text(label, x + 5, yPos + 10);
    
    doc.setFontSize(FONTS.NORMAL);
    doc.text(value, x + 5, yPos + 22);
  };

  // Criar os três boxes
  createHighlightBox(startX, "Unidade Consumidora", config.uc);
  createHighlightBox(startX + boxWidth + spacing, "Data Vencimento", config.dueDate);
  createHighlightBox(startX + (boxWidth + spacing) * 2, "Valor a Pagar", config.amount);

  return yPos + boxHeight + 10;
};
