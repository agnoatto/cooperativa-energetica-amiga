
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency } from "./pdfUtils";
import { PdfBoxConfig, PdfFaturaData } from "@/types/pdf";

// Cores para o PDF
const COLORS = {
  RED: [234, 56, 76],     // #ea384c
  BLUE: [15, 160, 206],   // #0FA0CE
  GREEN: [197, 255, 114], // #C5FF72
  GRAY: [248, 248, 248],  // #F8F8F8
  DARK: [51, 51, 51],     // #333333
  WHITE: [255, 255, 255]  // #FFFFFF
};

// Configurações de fonte
const FONTS = {
  TITLE: 24,
  SUBTITLE: 16,
  NORMAL: 12,
  SMALL: 10,
  HIGHLIGHT: 18
};

// Configurações de espaçamento
const SPACING = {
  SECTION: 30,
  PARAGRAPH: 15,
  LINE: 8
};

export const addHeader = (doc: jsPDF, fatura: PdfFaturaData, yPos: number): number => {
  yPos += 5;
  doc.setFontSize(FONTS.TITLE);
  doc.setTextColor(COLORS.DARK[0], COLORS.DARK[1], COLORS.DARK[2]);
  const title = `Análise Mensal - ${format(new Date(fatura.ano, fatura.mes - 1), 'MMMM/yyyy', { locale: ptBR })}`;
  doc.text(title, 105, yPos, { align: 'center' });
  return yPos;
};

export const addClientInfo = (doc: jsPDF, fatura: PdfFaturaData, yPos: number): number => {
  doc.setFontSize(FONTS.NORMAL);
  doc.setTextColor(COLORS.DARK[0], COLORS.DARK[1], COLORS.DARK[2]);
  
  // Cliente
  doc.text("Cliente:", 20, yPos);
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text(fatura.unidade_beneficiaria.cooperado.nome, 20, yPos + 7);
  
  // Endereço
  yPos += 20;
  doc.setFontSize(FONTS.NORMAL);
  doc.text("Endereço:", 20, yPos);
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text(fatura.unidade_beneficiaria.endereco, 20, yPos + 7);
  
  return yPos;
};

export const addInfoBox = (doc: jsPDF, config: PdfBoxConfig): void => {
  // Box com fundo verde claro
  doc.setFillColor(COLORS.GREEN[0], COLORS.GREEN[1], COLORS.GREEN[2]);
  doc.roundedRect(config.x, config.y, config.width, config.height, 3, 3, 'F');
  
  // Label
  doc.setTextColor(COLORS.DARK[0], COLORS.DARK[1], COLORS.DARK[2]);
  doc.setFontSize(FONTS.SMALL);
  doc.text(config.label, config.x + 5, config.y + 7);
  
  // Valor em destaque
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text(config.value, config.x + 5, config.y + 20);
};

export const addBillAnalysis = (doc: jsPDF, fatura: PdfFaturaData, yPos: number): number => {
  // Cabeçalho "Fatura SEM a Cogesol"
  doc.setFillColor(COLORS.GRAY[0], COLORS.GRAY[1], COLORS.GRAY[2]);
  doc.rect(20, yPos, 170, 12, 'F');
  doc.setTextColor(COLORS.RED[0], COLORS.RED[1], COLORS.RED[2]);
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text("Fatura SEM a Cogesol", 25, yPos + 8);
  
  // Tabela de valores
  yPos += 20;
  doc.setTextColor(COLORS.DARK[0], COLORS.DARK[1], COLORS.DARK[2]);
  doc.setFontSize(FONTS.NORMAL);
  
  // Cabeçalhos da tabela
  const columns = ["Quantidade", "Tarifa", "Valor"];
  const columnPositions = [25, 80, 135];
  columns.forEach((col, index) => {
    doc.text(col, columnPositions[index], yPos);
  });
  
  // Valores
  yPos += 10;
  const tarifa = (fatura.total_fatura - fatura.iluminacao_publica - fatura.outros_valores) / fatura.consumo_kwh;
  
  doc.text(`${fatura.consumo_kwh} kWh`, 25, yPos);
  doc.text(formatCurrency(tarifa), 80, yPos);
  doc.text(formatCurrency(fatura.total_fatura), 135, yPos);
  
  return yPos;
};

export const addCogesolBillAnalysis = (doc: jsPDF, fatura: PdfFaturaData, yPos: number): number => {
  // Cabeçalho "Fatura COM a Cogesol"
  doc.setFillColor(COLORS.BLUE[0], COLORS.BLUE[1], COLORS.BLUE[2], 0.1);
  doc.rect(20, yPos, 170, 12, 'F');
  doc.setTextColor(COLORS.BLUE[0], COLORS.BLUE[1], COLORS.BLUE[2]);
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text("Fatura COM a Cogesol", 25, yPos + 8);
  
  // Valores
  yPos += 20;
  doc.setTextColor(COLORS.DARK[0], COLORS.DARK[1], COLORS.DARK[2]);
  doc.setFontSize(FONTS.NORMAL);
  
  // Fatura RGE
  doc.text("Fatura RGE", 25, yPos);
  doc.text(formatCurrency(fatura.fatura_concessionaria), 135, yPos);
  
  // Fatura Cogesol
  yPos += 10;
  doc.text("Fatura Cogesol", 25, yPos);
  doc.text(formatCurrency(fatura.valor_total), 135, yPos);
  
  return yPos;
};

export const addEconomySection = (doc: jsPDF, fatura: PdfFaturaData, yPos: number): number => {
  // Cabeçalho "Cálculo da Economia"
  doc.setFillColor(COLORS.BLUE[0], COLORS.BLUE[1], COLORS.BLUE[2], 0.1);
  doc.rect(20, yPos, 170, 12, 'F');
  doc.setTextColor(COLORS.BLUE[0], COLORS.BLUE[1], COLORS.BLUE[2]);
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text("Cálculo da Economia", 25, yPos + 8);
  
  // Box de economia
  yPos += 20;
  const economia = fatura.total_fatura - fatura.valor_total;
  doc.setFillColor(COLORS.GREEN[0], COLORS.GREEN[1], COLORS.GREEN[2]);
  doc.roundedRect(20, yPos, 170, 35, 3, 3, 'F');
  
  // Texto "Total ECONOMIA sobre o consumo"
  doc.setTextColor(COLORS.DARK[0], COLORS.DARK[1], COLORS.DARK[2]);
  doc.setFontSize(FONTS.NORMAL);
  doc.text("Total ECONOMIA sobre o consumo", 30, yPos + 15);
  
  // Valor da economia em destaque
  doc.setFontSize(FONTS.HIGHLIGHT);
  doc.text(formatCurrency(economia), 30, yPos + 30);
  
  return yPos + 45;
};

export const addCompanyInfo = (doc: jsPDF, yPos: number): number => {
  // Informações da empresa
  doc.setTextColor(COLORS.DARK[0], COLORS.DARK[1], COLORS.DARK[2]);
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
  doc.setFillColor(COLORS.GREEN[0], COLORS.GREEN[1], COLORS.GREEN[2]);
  doc.roundedRect(120, yPos - 5, 70, 35, 3, 3, 'F');
  doc.setTextColor(COLORS.DARK[0], COLORS.DARK[1], COLORS.DARK[2]);
  doc.text("Total a pagar para", 125, yPos + 8);
  doc.text("essa unidade:", 125, yPos + 16);
  doc.setFontSize(FONTS.HIGHLIGHT);
  doc.text(formatCurrency(924.45), 125, yPos + 28);
  
  return yPos + 40;
};

export const addPaymentInfo = (doc: jsPDF, yPos: number): number => {
  // Box com instruções de pagamento
  doc.setFillColor(COLORS.GREEN[0], COLORS.GREEN[1], COLORS.GREEN[2]);
  doc.rect(20, yPos, 170, 25, 'F');
  doc.setTextColor(COLORS.DARK[0], COLORS.DARK[1], COLORS.DARK[2]);
  doc.setFontSize(FONTS.NORMAL);
  doc.text("Deverá ser pago a sua fatura COGESOL e a fatura RGE!", 25, yPos + 10);
  doc.text("Utilize o QR Code abaixo para pagamento", 25, yPos + 20);
  
  return yPos + 35;
};

export const addFooter = (doc: jsPDF, yPos: number): void => {
  doc.setFontSize(FONTS.SMALL);
  doc.setTextColor(COLORS.DARK[0], COLORS.DARK[1], COLORS.DARK[2]);
  doc.text("COGESOL - Cooperativa de Geração de Energia Solar", 20, yPos);
  yPos += 5;
  doc.text("Endereço: Rua Julio Golin, 552 - Centro - Nonoai/RS", 20, yPos);
};
