
import { jsPDF } from "jspdf";
import { COLORS, FONTS } from "./constants";

export const addClientInfo = (doc: jsPDF, fatura: any, yPos: number): number => {
  doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
  doc.setFontSize(FONTS.NORMAL);

  // Coluna da esquerda
  doc.text("Cliente:", 20, yPos);
  doc.text(fatura.unidade_beneficiaria.cooperado.nome, 20, yPos + 7);
  doc.text("Endereço:", 20, yPos + 20);
  doc.text(fatura.unidade_beneficiaria.endereco, 20, yPos + 27);

  // Coluna da direita
  doc.text("CPF/CNPJ:", 120, yPos);
  doc.text(fatura.unidade_beneficiaria.cooperado.documento || "-", 120, yPos + 7);
  doc.text("Cidade:", 120, yPos + 20);
  const cidade = "Cidade"; // Adicionar cidade quando disponível
  doc.text(cidade, 120, yPos + 27);

  return yPos + 40;
};

export const addHighlightBoxes = (doc: jsPDF, config: any, yPos: number): number => {
  const boxWidth = 50;
  const boxHeight = 30;
  const spacing = 10;

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
  createHighlightBox(20, "Unidade Consumidora", config.uc);
  createHighlightBox(80, "Data Vencimento", config.dueDate);
  createHighlightBox(140, "Valor a Pagar", config.amount);

  return yPos + boxHeight + spacing;
};
