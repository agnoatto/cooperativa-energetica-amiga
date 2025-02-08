
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { formatCurrency } from "./pdfUtils";

// Constantes de cores
const COLORS = {
  DARK_BLUE: [0, 32, 46],    // Fundo do cabeçalho
  LIME_GREEN: [197, 255, 114], // Boxes de destaque
  RED: [255, 0, 0],          // Valores sem Cogesol
  BLUE: [0, 114, 206],       // Valores com Cogesol
  WHITE: [255, 255, 255],    // Textos sobre fundo escuro
  BLACK: [0, 0, 0],          // Textos normais
  LIGHT_GRAY: [240, 240, 240] // Fundo de algumas seções
};

// Configurações de fonte
const FONTS = {
  TITLE: 16,
  SUBTITLE: 14,
  NORMAL: 12,
  SMALL: 10
};

export const addHeader = (doc: jsPDF, config: { title: string; logoPath: string }): number => {
  // Fundo azul escuro
  doc.setFillColor(COLORS.DARK_BLUE[0], COLORS.DARK_BLUE[1], COLORS.DARK_BLUE[2]);
  doc.rect(0, 0, 210, 30, 'F');

  // Título
  doc.setTextColor(COLORS.WHITE[0], COLORS.WHITE[1], COLORS.WHITE[2]);
  doc.setFontSize(FONTS.TITLE);
  doc.text(config.title, 20, 20);

  // Logo será adicionada à direita
  return 40;
};

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
  createHighlightBox(140, "Valor a Pagar", formatCurrency(config.amount));

  return yPos + boxHeight + spacing;
};

export const addMonthlyAnalysis = (doc: jsPDF, data: any, yPos: number): number => {
  // Título da seção
  doc.setFillColor(COLORS.LIGHT_GRAY[0], COLORS.LIGHT_GRAY[1], COLORS.LIGHT_GRAY[2]);
  doc.rect(20, yPos, 170, 10, 'F');
  doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text("Análise Mensal", 25, yPos + 7);

  yPos += 20;

  // Coluna da esquerda
  doc.setFontSize(FONTS.NORMAL);
  
  // Box de consumo
  doc.setFillColor(COLORS.LIME_GREEN[0], COLORS.LIME_GREEN[1], COLORS.LIME_GREEN[2]);
  doc.roundedRect(20, yPos, 80, 25, 3, 3, 'F');
  doc.text(`Consumo do mês: ${data.consumo} kWh`, 25, yPos + 15);

  // Economia do mês
  yPos += 35;
  doc.text("Neste mês você economizou:", 20, yPos);
  doc.setFillColor(COLORS.LIME_GREEN[0], COLORS.LIME_GREEN[1], COLORS.LIME_GREEN[2]);
  doc.roundedRect(20, yPos + 5, 80, 25, 3, 3, 'F');
  doc.text(formatCurrency(data.valorFaturaSemCogesol - data.valorFaturaComCogesol), 25, yPos + 20);

  // Economia acumulada
  yPos += 40;
  doc.text("Até agora já economizou:", 20, yPos);
  doc.setFillColor(COLORS.LIME_GREEN[0], COLORS.LIME_GREEN[1], COLORS.LIME_GREEN[2]);
  doc.roundedRect(20, yPos + 5, 80, 25, 3, 3, 'F');
  doc.text(formatCurrency(data.economiaAcumulada), 25, yPos + 20);

  // Coluna da direita - Análise de valores
  let rightColumnY = yPos - 75;

  // Fatura SEM Cogesol
  doc.setTextColor(COLORS.RED[0], COLORS.RED[1], COLORS.RED[2]);
  doc.text("Fatura SEM a Cogesol:", 110, rightColumnY);
  doc.text(formatCurrency(data.valorFaturaSemCogesol), 110, rightColumnY + 10);

  // Fatura COM Cogesol
  rightColumnY += 30;
  doc.setTextColor(COLORS.BLUE[0], COLORS.BLUE[1], COLORS.BLUE[2]);
  doc.text("Fatura COM a Cogesol:", 110, rightColumnY);
  doc.text(`Fatura RGE: ${formatCurrency(data.faturaConcessionaria)}`, 110, rightColumnY + 10);
  doc.text(`Fatura Cogesol: ${formatCurrency(data.valorFaturaComCogesol)}`, 110, rightColumnY + 20);

  return yPos + 70;
};

export const addCompanyFooter = (doc: jsPDF, valorTotal: number, yPos: number): number => {
  // Informações da empresa
  doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
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
  doc.setFillColor(COLORS.LIME_GREEN[0], COLORS.LIME_GREEN[1], COLORS.LIME_GREEN[2]);
  doc.roundedRect(120, yPos - 5, 70, 35, 3, 3, 'F');
  doc.text("Total a pagar:", 125, yPos + 8);
  doc.setFontSize(FONTS.TITLE);
  doc.text(formatCurrency(valorTotal), 125, yPos + 25);

  return yPos + 40;
};

export const addPaymentData = (doc: jsPDF, yPos: number): void => {
  // Barra verde com mensagem
  doc.setFillColor(COLORS.LIME_GREEN[0], COLORS.LIME_GREEN[1], COLORS.LIME_GREEN[2]);
  doc.rect(0, yPos, 210, 20, 'F');
  doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
  doc.setFontSize(FONTS.NORMAL);
  doc.text("Deverá ser pago a sua fatura COGESOL e a fatura RGE!", 20, yPos + 13);

  // Barra azul com dados de pagamento
  yPos += 20;
  doc.setFillColor(COLORS.DARK_BLUE[0], COLORS.DARK_BLUE[1], COLORS.DARK_BLUE[2]);
  doc.rect(0, yPos, 210, 20, 'F');
  doc.setTextColor(COLORS.WHITE[0], COLORS.WHITE[1], COLORS.WHITE[2]);
  doc.text("Dados de Pagamento Em Anexo", 20, yPos + 13);
};
