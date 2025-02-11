
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BoletimMedicaoData } from "@/components/pagamentos/types/boletim";
import { COLORS, FONTS, SPACING } from "./constants";
import { formatCurrency } from "../pdfUtils";
import { generateChartImage } from "./chartUtils";

export const addUsinaInfo = (doc: jsPDF, data: BoletimMedicaoData, yPos: number): number => {
  doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
  doc.setFontSize(FONTS.NORMAL);

  const info = [
    { label: "Nome da Usina:", value: data.usina.nome_investidor },
    { label: "UC:", value: data.usina.numero_uc },
    { label: "Concessionária:", value: data.usina.concessionaria },
    { label: "Modalidade:", value: data.usina.modalidade },
    { label: "Valor da Tarifa:", value: formatCurrency(data.usina.valor_kwh) },
    { label: "Valor a Receber:", value: formatCurrency(data.valor_receber) },
  ];

  info.forEach((item, index) => {
    const y = yPos + (index * 7);
    doc.text(item.label, SPACING.MARGIN, y);
    doc.text(item.value, SPACING.MARGIN + 50, y);
  });

  return yPos + (info.length * 7) + 10;
};

export const addCharts = async (doc: jsPDF, data: BoletimMedicaoData, yPos: number): Promise<number> => {
  const chartHeight = 45; // Reduced chart height
  
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text("Geração (kWh/mês)", SPACING.MARGIN, yPos);
  
  const geracaoChart = await generateChartImage(data.pagamentos, {
    width: 400,
    height: 150,
    dataKey: "geracao",
    yAxisLabel: "kWh",
    formatter: (value: number) => value.toLocaleString('pt-BR')
  });
  
  doc.addImage(
    geracaoChart,
    'PNG',
    SPACING.MARGIN,
    yPos + 5,
    SPACING.PAGE.CONTENT_WIDTH - 20,
    chartHeight
  );

  const nextYPos = yPos + chartHeight + 15;
  doc.text("Recebimentos (R$)", SPACING.MARGIN, nextYPos);
  
  const recebimentosChart = await generateChartImage(data.pagamentos, {
    width: 400,
    height: 150,
    dataKey: "valor",
    yAxisLabel: "R$",
    formatter: (value: number) => formatCurrency(value)
  });
  
  doc.addImage(
    recebimentosChart,
    'PNG',
    SPACING.MARGIN,
    nextYPos + 5,
    SPACING.PAGE.CONTENT_WIDTH - 20,
    chartHeight
  );

  return nextYPos + chartHeight + 15;
};

export const addDataTable = (doc: jsPDF, data: BoletimMedicaoData, yPos: number): number => {
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text("Dados de Medição", SPACING.MARGIN, yPos);

  const headers = [
    "Mês",
    "Geração (kWh)",
    "TUSD Fio B",
    "Valor Concessionária",
    "Valor Total"
  ];

  const rows = data.pagamentos.slice(-12).map(pagamento => [
    format(new Date(pagamento.ano, pagamento.mes - 1), 'MMM/yyyy', { locale: ptBR }),
    pagamento.geracao_kwh.toString(),
    formatCurrency(pagamento.tusd_fio_b || 0),
    formatCurrency(pagamento.valor_concessionaria),
    formatCurrency(pagamento.valor_total)
  ]);

  doc.setFontSize(FONTS.SMALL);
  const cellPadding = 2;
  const cellHeight = 7;
  const columnWidths = [30, 35, 35, 35, 35]; // Widths for each column
  let currentX = SPACING.MARGIN;

  // Draw header background
  doc.setFillColor(240, 240, 240);
  doc.rect(SPACING.MARGIN, yPos + 5, SPACING.PAGE.CONTENT_WIDTH - 20, cellHeight, 'F');

  // Draw headers
  doc.setFontSize(FONTS.SMALL);
  doc.setFont("helvetica", "bold"); // Changed from setFontStyle to setFont with style parameter
  headers.forEach((header, index) => {
    doc.text(header, currentX, yPos + 10);
    currentX += columnWidths[index];
  });

  // Draw rows with alternating background
  doc.setFont("helvetica", "normal"); // Reset font style to normal for row data
  rows.forEach((row, rowIndex) => {
    const rowY = yPos + 12 + ((rowIndex + 1) * cellHeight);
    
    // Add alternating row background
    if (rowIndex % 2 === 0) {
      doc.setFillColor(245, 245, 245);
      doc.rect(SPACING.MARGIN, rowY - 5, SPACING.PAGE.CONTENT_WIDTH - 20, cellHeight, 'F');
    }

    // Draw cell borders
    doc.setDrawColor(220, 220, 220);
    currentX = SPACING.MARGIN;
    row.forEach((cell, cellIndex) => {
      doc.text(cell, currentX, rowY);
      currentX += columnWidths[cellIndex];
    });
  });

  // Draw outer border
  doc.setDrawColor(200, 200, 200);
  doc.rect(
    SPACING.MARGIN,
    yPos + 5,
    SPACING.PAGE.CONTENT_WIDTH - 20,
    (rows.length + 1) * cellHeight,
    'S'
  );

  return yPos + 15 + ((rows.length + 1) * cellHeight);
};

