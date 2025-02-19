
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { COLORS, FONTS, SPACING } from "./constants";
import { PdfFaturaData } from "@/types/pdf";

export const addEconomyInfo = (doc: jsPDF, fatura: PdfFaturaData, yPos: number): number => {
  doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text("Economia", SPACING.MARGIN, yPos);
  
  yPos += 6;

  // Box de economia do mês
  doc.setFillColor(COLORS.LIME_GREEN[0], COLORS.LIME_GREEN[1], COLORS.LIME_GREEN[2]);
  const boxWidth = (SPACING.PAGE.CONTENT_WIDTH - 5) / 2;
  const boxHeight = 20;

  // Economia do mês
  doc.roundedRect(SPACING.MARGIN, yPos, boxWidth, boxHeight, 2, 2, 'F');
  doc.setFontSize(FONTS.SMALL);
  doc.text("Economia neste mês:", SPACING.MARGIN + 4, yPos + 6);
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text(
    formatCurrency(fatura.valor_desconto),
    SPACING.MARGIN + 4,
    yPos + 15
  );

  // Total a pagar
  doc.roundedRect(
    SPACING.MARGIN + boxWidth + 5,
    yPos,
    boxWidth,
    boxHeight,
    2,
    2,
    'F'
  );
  doc.setFontSize(FONTS.SMALL);
  doc.text(
    "Total a pagar:",
    SPACING.MARGIN + boxWidth + 9,
    yPos + 6
  );
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text(
    formatCurrency(fatura.valor_assinatura),
    SPACING.MARGIN + boxWidth + 9,
    yPos + 15
  );

  // Adicionar tabela de histórico
  yPos += boxHeight + 10;
  doc.setFontSize(FONTS.SMALL);
  doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
  doc.text("Histórico de Consumo e Economia", SPACING.MARGIN, yPos);

  // Configuração da tabela
  const colunas = ["Mês/Ano", "Consumo", "Economia"];
  const larguraColunas = [40, 40, 40];
  const alturaLinha = 8;

  // Cabeçalho da tabela
  yPos += 6;
  doc.setFillColor(COLORS.LIME_GREEN[0], COLORS.LIME_GREEN[1], COLORS.LIME_GREEN[2]);
  doc.rect(SPACING.MARGIN, yPos, larguraColunas.reduce((a, b) => a + b), alturaLinha, 'F');
  
  // Texto do cabeçalho
  doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
  let xPos = SPACING.MARGIN + 4;
  colunas.forEach((coluna, index) => {
    doc.text(coluna, xPos, yPos + 6);
    xPos += larguraColunas[index];
  });

  // Linhas da tabela
  yPos += alturaLinha;
  doc.setFontSize(FONTS.SMALL);
  
  // Ordenar histórico do mais recente para o mais antigo
  const historico = [...fatura.historico_faturas].sort((a, b) => {
    if (a.ano !== b.ano) return b.ano - a.ano;
    return b.mes - a.mes;
  });

  // Limitar a 6 meses de histórico
  historico.slice(0, 6).forEach((item) => {
    xPos = SPACING.MARGIN + 4;
    
    // Mês/Ano
    const mesAno = format(new Date(item.ano, item.mes - 1), 'MMM/yyyy', { locale: ptBR });
    doc.text(mesAno, xPos, yPos + 6);
    
    // Consumo
    xPos += larguraColunas[0];
    doc.text(`${item.consumo_kwh} kWh`, xPos, yPos + 6);
    
    // Economia
    xPos += larguraColunas[1];
    doc.text(formatCurrency(item.valor_desconto), xPos, yPos + 6);
    
    // Linha separadora
    doc.setDrawColor(COLORS.GRAY[0], COLORS.GRAY[1], COLORS.GRAY[2]);
    doc.line(
      SPACING.MARGIN,
      yPos + alturaLinha,
      SPACING.MARGIN + larguraColunas.reduce((a, b) => a + b),
      yPos + alturaLinha
    );
    
    yPos += alturaLinha;
  });

  return yPos + 6;
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
