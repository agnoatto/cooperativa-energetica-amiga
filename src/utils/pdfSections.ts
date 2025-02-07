import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency } from "./pdfUtils";
import { PdfBoxConfig, PdfFaturaData } from "@/types/pdf";

const BOX_BG_COLOR: [number, number, number] = [197, 255, 114];

export const addHeader = (doc: jsPDF, fatura: PdfFaturaData, yPos: number): number => {
  // Title
  yPos += 5;
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(
    `Relatório Mensal - Ref.: ${format(new Date(fatura.ano, fatura.mes - 1), 'MMMM/yyyy', { locale: ptBR })}`,
    70,
    yPos
  );
  
  return yPos;
};

export const addClientInfo = (doc: jsPDF, fatura: PdfFaturaData, yPos: number): number => {
  doc.setFontSize(11);
  
  // Left column
  doc.text("Cliente:", 20, yPos);
  doc.setFontSize(10);
  doc.text(fatura.unidade_beneficiaria.cooperado.nome, 20, yPos + 5);
  
  doc.setFontSize(11);
  doc.text("Endereço:", 20, yPos + 15);
  doc.setFontSize(10);
  doc.text(fatura.unidade_beneficiaria.endereco, 20, yPos + 20);
  
  // Right column
  if (fatura.unidade_beneficiaria.cooperado.documento) {
    doc.setFontSize(11);
    doc.text("CPF/CNPJ:", 120, yPos);
    doc.setFontSize(10);
    doc.text(fatura.unidade_beneficiaria.cooperado.documento, 120, yPos + 5);
  }
  
  return yPos;
};

export const addInfoBox = (doc: jsPDF, config: PdfBoxConfig): void => {
  doc.setFillColor(BOX_BG_COLOR[0], BOX_BG_COLOR[1], BOX_BG_COLOR[2]);
  doc.roundedRect(config.x, config.y, config.width, config.height, 3, 3, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.text(config.label, config.x + 5, config.y + 8);
  doc.setFontSize(12);
  doc.text(config.value, config.x + 5, config.y + 18);
};

export const addMonthlyAnalysis = (doc: jsPDF, fatura: PdfFaturaData, yPos: number): number => {
  // Left column - Consumption and Savings
  doc.setFontSize(10);
  doc.text("Consumo do mês:", 20, yPos);
  doc.text(`${fatura.consumo_kwh} kWh`, 80, yPos);
  
  yPos += 7;
  doc.text("Economia do mês:", 20, yPos);
  doc.text(formatCurrency(fatura.valor_desconto), 80, yPos);
  
  yPos += 7;
  doc.text("Economia acumulada:", 20, yPos);
  doc.text(formatCurrency(fatura.economia_acumulada), 80, yPos);
  
  return yPos;
};

export const addBillAnalysis = (doc: jsPDF, fatura: PdfFaturaData, yPos: number): number => {
  // Right column - Bill without Cogesol
  doc.setFontSize(11);
  doc.text("Fatura SEM a Cogesol", 120, yPos);
  yPos += 7;
  
  const tarifa = (fatura.total_fatura - fatura.iluminacao_publica - fatura.outros_valores) / fatura.consumo_kwh;
  
  doc.setFontSize(10);
  doc.text(`Consumo (${fatura.consumo_kwh} kWh x ${formatCurrency(tarifa)})`, 120, yPos);
  doc.text(formatCurrency(fatura.total_fatura), 180, yPos);
  
  yPos += 7;
  doc.text("Iluminação Pública", 120, yPos);
  doc.text(formatCurrency(fatura.iluminacao_publica), 180, yPos);
  
  yPos += 7;
  doc.text("Demais valores", 120, yPos);
  doc.text(formatCurrency(fatura.outros_valores), 180, yPos);
  
  const totalSemCogesol = fatura.total_fatura + fatura.iluminacao_publica + fatura.outros_valores;
  yPos += 7;
  doc.setFont("helvetica", "bold");
  doc.text("Total", 120, yPos);
  doc.text(formatCurrency(totalSemCogesol), 180, yPos);
  doc.setFont("helvetica", "normal");
  
  return totalSemCogesol;
};

export const addCogesolBillAnalysis = (doc: jsPDF, fatura: PdfFaturaData, yPos: number): { yPos: number; totalComCogesol: number } => {
  doc.setFontSize(11);
  doc.text("Fatura COM a Cogesol", 120, yPos);
  
  yPos += 7;
  doc.setFontSize(10);
  doc.text("Fatura Concessionária", 120, yPos);
  doc.text(formatCurrency(fatura.fatura_concessionaria), 180, yPos);
  
  yPos += 7;
  doc.text("Fatura Cogesol", 120, yPos);
  doc.text(formatCurrency(fatura.valor_total), 180, yPos);
  
  const totalComCogesol = fatura.fatura_concessionaria + fatura.valor_total;
  yPos += 7;
  doc.setFont("helvetica", "bold");
  doc.text("Total", 120, yPos);
  doc.text(formatCurrency(totalComCogesol), 180, yPos);
  doc.setFont("helvetica", "normal");
  
  return { yPos, totalComCogesol };
};

export const addFooter = (doc: jsPDF, yPos: number): void => {
  doc.setFontSize(8);
  doc.text("COGESOL - Cooperativa de Geração de Energia Solar", 20, yPos);
  yPos += 5;
  doc.text("Endereço: Rua Example, 123 - Cidade/UF", 20, yPos);
};
