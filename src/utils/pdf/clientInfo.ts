
import { jsPDF } from "jspdf";
import { COLORS, FONTS, SPACING } from "./constants";
import { PdfFaturaData } from "@/types/pdf";
import { formatarDocumento } from "../formatters";
import { format } from "date-fns";

export const addClientInfo = (doc: jsPDF, fatura: PdfFaturaData, yPos: number): number => {
  doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text("Informações do Cliente", SPACING.MARGIN, yPos);
  
  yPos += 10;
  doc.setFontSize(FONTS.NORMAL);

  // Grid de informações do cliente
  const grid = [
    { label: "Nome:", value: fatura.unidade_beneficiaria.cooperado.nome },
    { label: "CPF/CNPJ:", value: formatarDocumento(fatura.unidade_beneficiaria.cooperado.documento || "") },
    { label: "Unidade Consumidora:", value: fatura.unidade_beneficiaria.numero_uc },
    { label: "Endereço:", value: fatura.unidade_beneficiaria.endereco },
  ];

  grid.forEach((item, index) => {
    const y = yPos + (index * 8);
    doc.text(item.label, SPACING.MARGIN, y);
    doc.text(item.value, SPACING.MARGIN + 50, y);
  });

  yPos += 40;

  // Boxes de destaque
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

  const boxWidth = 60;
  const boxHeight = 25;
  const spacing = 10;

  boxes.forEach((box, index) => {
    const xPos = SPACING.MARGIN + (boxWidth + spacing) * index;
    
    doc.setFillColor(COLORS.LIME_GREEN[0], COLORS.LIME_GREEN[1], COLORS.LIME_GREEN[2]);
    doc.roundedRect(xPos, yPos, boxWidth, boxHeight, 3, 3, 'F');
    
    doc.setFontSize(FONTS.SMALL);
    doc.text(box.label, xPos + 4, yPos + 7);
    
    doc.setFontSize(FONTS.NORMAL);
    doc.text(box.value, xPos + 4, yPos + 18);
  });

  return yPos + boxHeight + 15;
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
