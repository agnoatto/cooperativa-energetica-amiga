
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency } from "./pdfUtils";
import { PdfBoxConfig, PdfFaturaData } from "@/types/pdf";

// Cores para o PDF
const COLORS = {
  RED: [234, 56, 76], // #ea384c
  BLUE: [15, 160, 206], // #0FA0CE
  GREEN: [197, 255, 114],
  GRAY: [245, 245, 245],
  BLACK: [0, 0, 0],
  WHITE: [255, 255, 255]
};

// Configurações de fonte
const FONTS = {
  TITLE: 16,
  SUBTITLE: 14,
  NORMAL: 12,
  SMALL: 10
};

export const addHeader = (doc: jsPDF, fatura: PdfFaturaData, yPos: number): number => {
  yPos += 5;
  doc.setFontSize(FONTS.TITLE);
  doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
  doc.text(
    `Análise Mensal - ${format(new Date(fatura.ano, fatura.mes - 1), 'MMMM/yyyy', { locale: ptBR })}`,
    70,
    yPos
  );
  
  return yPos;
};

export const addClientInfo = (doc: jsPDF, fatura: PdfFaturaData, yPos: number): number => {
  doc.setFontSize(FONTS.NORMAL);
  
  doc.text("Cliente:", 20, yPos);
  doc.setFontSize(FONTS.SMALL);
  doc.text(fatura.unidade_beneficiaria.cooperado.nome, 20, yPos + 5);
  
  doc.setFontSize(FONTS.NORMAL);
  doc.text("Endereço:", 20, yPos + 15);
  doc.setFontSize(FONTS.SMALL);
  doc.text(fatura.unidade_beneficiaria.endereco, 20, yPos + 20);
  
  return yPos;
};

export const addInfoBox = (doc: jsPDF, config: PdfBoxConfig): void => {
  doc.setFillColor(COLORS.GREEN[0], COLORS.GREEN[1], COLORS.GREEN[2]);
  doc.roundedRect(config.x, config.y, config.width, config.height, 3, 3, 'F');
  doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
  doc.setFontSize(FONTS.SMALL);
  doc.text(config.label, config.x + 5, config.y + 8);
  doc.setFontSize(FONTS.NORMAL);
  doc.text(config.value, config.x + 5, config.y + 18);
};

export const addBillAnalysis = (doc: jsPDF, fatura: PdfFaturaData, yPos: number): number => {
  // Cabeçalho Fatura SEM Cogesol
  doc.setFillColor(COLORS.GRAY[0], COLORS.GRAY[1], COLORS.GRAY[2]);
  doc.rect(20, yPos - 5, 170, 10, 'F');
  doc.setTextColor(COLORS.RED[0], COLORS.RED[1], COLORS.RED[2]);
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text("Fatura SEM a Cogesol", 25, yPos + 2);
  
  yPos += 15;
  doc.setFontSize(FONTS.NORMAL);
  doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
  
  // Cabeçalho da tabela
  const columns = ["Quantidade", "Tarifa", "Valor a Pagar"];
  const columnWidth = 50;
  columns.forEach((col, index) => {
    doc.text(col, 25 + (index * columnWidth), yPos);
  });
  
  yPos += 10;
  const tarifa = (fatura.total_fatura - fatura.iluminacao_publica - fatura.outros_valores) / fatura.consumo_kwh;
  
  // Linha de consumo
  doc.text(`${fatura.consumo_kwh} kWh`, 25, yPos);
  doc.text(formatCurrency(tarifa), 75, yPos);
  doc.text(formatCurrency(fatura.total_fatura), 125, yPos);
  
  return yPos;
};

export const addCogesolBillAnalysis = (doc: jsPDF, fatura: PdfFaturaData, yPos: number): number => {
  // Cabeçalho Fatura COM Cogesol
  doc.setFillColor(COLORS.BLUE[0], COLORS.BLUE[1], COLORS.BLUE[2], 0.1);
  doc.rect(20, yPos - 5, 170, 10, 'F');
  doc.setTextColor(COLORS.BLUE[0], COLORS.BLUE[1], COLORS.BLUE[2]);
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text("Fatura COM a Cogesol", 25, yPos + 2);
  
  yPos += 15;
  doc.setFontSize(FONTS.NORMAL);
  doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
  
  // Valores
  doc.text("Fatura RGE", 25, yPos);
  doc.text(formatCurrency(fatura.fatura_concessionaria), 125, yPos);
  
  yPos += 10;
  doc.text("Fatura Cogesol", 25, yPos);
  doc.text(formatCurrency(fatura.valor_total), 125, yPos);
  
  return yPos;
};

export const addEconomySection = (doc: jsPDF, fatura: PdfFaturaData, yPos: number): number => {
  // Título da seção
  doc.setFillColor(COLORS.BLUE[0], COLORS.BLUE[1], COLORS.BLUE[2], 0.1);
  doc.rect(20, yPos - 5, 170, 10, 'F');
  doc.setTextColor(COLORS.BLUE[0], COLORS.BLUE[1], COLORS.BLUE[2]);
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text("Cálculo da Economia", 25, yPos + 2);
  
  yPos += 20;
  
  // Box de economia
  const economia = fatura.total_fatura - fatura.valor_total;
  doc.setFillColor(COLORS.GREEN[0], COLORS.GREEN[1], COLORS.GREEN[2]);
  doc.roundedRect(20, yPos - 5, 170, 25, 3, 3, 'F');
  doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
  doc.setFontSize(FONTS.NORMAL);
  doc.text("Total ECONOMIA sobre o consumo", 25, yPos + 5);
  doc.setFontSize(FONTS.TITLE);
  doc.text(formatCurrency(economia), 25, yPos + 18);
  
  return yPos + 30;
};

export const addCompanyInfo = (doc: jsPDF, yPos: number): number => {
  // Informações da empresa
  doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
  doc.setFontSize(FONTS.NORMAL);
  doc.text("Razão Social: COGESOL Cooperativa de Energia Renovável", 20, yPos);
  yPos += 10;
  doc.text("CNPJ: 00.175.059/0001-00", 20, yPos);
  yPos += 10;
  doc.text("Rua Julio Golin, 552 - Centro - Nonoai/RS", 20, yPos);
  
  // Box com valor total
  yPos -= 20;
  doc.setFillColor(COLORS.GREEN[0], COLORS.GREEN[1], COLORS.GREEN[2]);
  doc.roundedRect(120, yPos - 5, 70, 30, 3, 3, 'F');
  doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
  doc.text("Total a pagar para", 125, yPos + 5);
  doc.text("essa unidade:", 125, yPos + 12);
  doc.setFontSize(FONTS.TITLE);
  doc.text(formatCurrency(924.45), 125, yPos + 22);
  
  // Mensagem de pagamento
  yPos += 30;
  doc.setFillColor(COLORS.GREEN[0], COLORS.GREEN[1], COLORS.GREEN[2]);
  doc.rect(20, yPos - 5, 170, 15, 'F');
  doc.setFontSize(FONTS.NORMAL);
  doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
  doc.text("Deverá ser pago a sua fatura COGESOL e a fatura RGE!", 25, yPos + 5);
  
  return yPos + 20;
};

export const addFooter = (doc: jsPDF, yPos: number): void => {
  doc.setFontSize(FONTS.SMALL);
  doc.text("COGESOL - Cooperativa de Geração de Energia Solar", 20, yPos);
  yPos += 5;
  doc.text("Endereço: Rua Julio Golin, 552 - Centro - Nonoai/RS", 20, yPos);
};

