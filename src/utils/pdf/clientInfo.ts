
import { jsPDF } from "jspdf";
import { COLORS, FONTS, SPACING } from "./constants";
import { PdfFaturaData } from "@/types/pdf";
import { formatarDocumento } from "../formatters";
import { format } from "date-fns";

export const addClientInfo = (doc: jsPDF, fatura: PdfFaturaData, yPos: number): number => {
  doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
  doc.setFontSize(FONTS.NORMAL);

  // Coluna da esquerda
  doc.text("Nome:", SPACING.MARGIN, yPos);
  doc.text(fatura.unidade_beneficiaria.cooperado.nome, SPACING.MARGIN + 50, yPos);
  
  doc.text("Endereço:", SPACING.MARGIN, yPos + 8);
  doc.text(fatura.unidade_beneficiaria.endereco, SPACING.MARGIN + 50, yPos + 8);

  // Coluna da direita
  const rightColumnX = SPACING.PAGE.WIDTH / 2 + 20;
  doc.text("CPF/CNPJ:", rightColumnX, yPos);
  doc.text(
    formatarDocumento(fatura.unidade_beneficiaria.cooperado.documento || ""), 
    rightColumnX + 50, 
    yPos
  );
  
  doc.text("Cidade:", rightColumnX, yPos + 8);
  doc.text("Nonoai/RS", rightColumnX + 50, yPos + 8);

  return addHighlightBoxes(doc, {
    uc: fatura.unidade_beneficiaria.numero_uc,
    dueDate: format(new Date(fatura.data_vencimento), 'dd/MM/yyyy'),
    amount: formatCurrency(fatura.valor_total)
  }, yPos + 20);
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const addHighlightBoxes = (
  doc: jsPDF, 
  config: { uc: string; dueDate: string; amount: string }, 
  yPos: number
): number => {
  const boxWidth = 60;
  const boxHeight = 25;
  const spacing = 10;
  const boxes = [
    { label: "Unidade Consumidora:", value: config.uc },
    { label: "Data de Vencimento:", value: config.dueDate },
    { label: "Valor a Pagar:", value: config.amount }
  ];

  boxes.forEach((box, index) => {
    const xPos = SPACING.MARGIN + (boxWidth + spacing) * index;
    
    doc.setFillColor(COLORS.LIME_GREEN[0], COLORS.LIME_GREEN[1], COLORS.LIME_GREEN[2]);
    doc.roundedRect(xPos, yPos, boxWidth, boxHeight, 3, 3, 'F');
    
    doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
    doc.setFontSize(FONTS.SMALL);
    doc.text(box.label, xPos + 4, yPos + 7);
    
    doc.setFontSize(FONTS.NORMAL);
    doc.text(box.value, xPos + 4, yPos + 18);
  });

  return yPos + boxHeight + 15;
};

export { addClientInfo };
