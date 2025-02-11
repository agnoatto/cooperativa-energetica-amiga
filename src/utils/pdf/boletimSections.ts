
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
  const last12Months = data.pagamentos
    .slice(-12)
    .map(p => ({
      month: p.mes,
      year: p.ano,
      geracao: p.geracao_kwh,
      valor: p.valor_total
    }));

  doc.setFontSize(FONTS.SUBTITLE);
  doc.text("Geração (kWh/mês)", SPACING.MARGIN, yPos);
  
  const geracaoChart = await generateChartImage(last12Months, {
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
    yPos + 10,
    SPACING.PAGE.CONTENT_WIDTH - 20,
    60
  );

  const nextYPos = yPos + 80;
  doc.text("Recebimentos (R$)", SPACING.MARGIN, nextYPos);
  
  const recebimentosChart = await generateChartImage(last12Months, {
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
    nextYPos + 10,
    SPACING.PAGE.CONTENT_WIDTH - 20,
    60
  );

  return nextYPos + 80;
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
  const cellPadding = 3;
  const cellHeight = 8;
  const columnWidth = (SPACING.PAGE.CONTENT_WIDTH) / headers.length;

  headers.forEach((header, index) => {
    doc.text(header, SPACING.MARGIN + (columnWidth * index), yPos + 10);
  });

  rows.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      doc.text(
        cell,
        SPACING.MARGIN + (columnWidth * cellIndex),
        yPos + 20 + (rowIndex * cellHeight)
      );
    });
  });

  return yPos + 20 + (rows.length * cellHeight) + cellPadding;
};

