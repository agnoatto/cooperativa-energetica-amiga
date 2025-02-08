
import { jsPDF } from "jspdf";
import { COLORS, FONTS, SPACING } from "./constants";
import { PdfFaturaData } from "@/types/pdf";
import { formatarDocumento } from "../formatters";
import { format } from "date-fns";

export const addClientInfo = (doc: jsPDF, fatura: PdfFaturaData, yPos: number): number => {
  doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text("Informações do Cliente", SPACING.MARGIN, yPos);
  
  yPos += 8;
  doc.setFontSize(FONTS.NORMAL);

  // Grid de informações do cliente
  const grid = [
    { label: "Nome:", value: fatura.unidade_beneficiaria.cooperado.nome },
    { label: "CPF/CNPJ:", value: formatarDocumento(fatura.unidade_beneficiaria.cooperado.documento || "") },
    { label: "Unidade Consumidora:", value: fatura.unidade_beneficiaria.numero_uc },
    { label: "Endereço:", value: fatura.unidade_beneficiaria.endereco },
  ];

  grid.forEach((item, index) => {
    const y = yPos + (index * 5);
    doc.text(item.label, SPACING.MARGIN, y);
    doc.text(item.value, SPACING.MARGIN + 40, y);
  });

  yPos += 25;

  // Boxes de destaque com tamanhos uniformes
  const boxWidth = SPACING.PAGE.CONTENT_WIDTH / 3 - 5;
  const boxHeight = 22;

  const boxes = [
    { 
      label: "Data de Vencimento",
      value: format(new Date(fatura.data_vencimento), 'dd/MM/yyyy')
    },
    { 
      label: "Consumo",
      value: `${fatura.consumo_kwh} kWh`
    },
    { 
      label: "Valor a Pagar",
      value: formatCurrency(fatura.valor_total)
    }
  ];

  boxes.forEach((box, index) => {
    const xPos = SPACING.MARGIN + (index * (boxWidth + 5));
    
    // Background color for boxes
    doc.setFillColor(COLORS.LIME_GREEN[0], COLORS.LIME_GREEN[1], COLORS.LIME_GREEN[2]);
    doc.roundedRect(xPos, yPos, boxWidth, boxHeight, 2, 2, 'F');
    
    // Label in black
    doc.setFontSize(FONTS.SMALL);
    doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
    doc.text(box.label, xPos + 4, yPos + 6);
    
    // Value in red for emphasis
    doc.setFontSize(FONTS.SUBTITLE);
    doc.setTextColor(COLORS.RED[0], COLORS.RED[1], COLORS.RED[2]);
    doc.text(box.value, xPos + 4, yPos + 16);
  });

  return yPos + boxHeight + 12;
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
