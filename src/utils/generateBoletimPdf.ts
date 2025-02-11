import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BoletimMedicaoData } from "@/components/pagamentos/types/boletim";
import { COLORS, FONTS, SPACING } from "./pdf/constants";
import { formatCurrency } from "./pdfUtils";

const generateChartImage = async (data: any[], config: { 
  width: number;
  height: number;
  dataKey: string;
  yAxisLabel: string;
  formatter?: (value: number) => string;
}) => {
  const chartCanvas = document.createElement('canvas');
  chartCanvas.width = config.width;
  chartCanvas.height = config.height;
  const ctx = chartCanvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  const maxValue = Math.max(...data.map(item => item[config.dataKey]));
  const barWidth = (config.width - 60) / data.length;
  const barHeightRatio = (config.height - 60) / maxValue;

  ctx.beginPath();
  ctx.moveTo(30, 30);
  ctx.lineTo(30, config.height - 30);
  ctx.lineTo(config.width - 30, config.height - 30);
  ctx.stroke();

  data.forEach((item, index) => {
    const barHeight = item[config.dataKey] * barHeightRatio;
    ctx.fillStyle = '#0EA5E9';
    ctx.fillRect(
      40 + (index * barWidth),
      config.height - 30 - barHeight,
      barWidth - 10,
      barHeight
    );

    ctx.save();
    ctx.translate(45 + (index * barWidth), config.height - 15);
    ctx.rotate(-Math.PI / 4);
    ctx.fillStyle = '#000000';
    ctx.font = '8px Arial';
    ctx.fillText(
      format(new Date(item.year, item.month - 1), 'MMM/yy', { locale: ptBR }),
      0,
      0
    );
    ctx.restore();
  });

  return chartCanvas.toDataURL('image/png');
};

const loadLogo = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
};

const addHeader = async (doc: jsPDF, config: { title: string; logoPath: string }): Promise<number> => {
  doc.setFillColor(COLORS.DARK_BLUE[0], COLORS.DARK_BLUE[1], COLORS.DARK_BLUE[2]);
  doc.rect(0, 0, SPACING.PAGE.WIDTH, SPACING.TOP, 'F');

  try {
    const logo = await loadLogo(config.logoPath);
    const logoWidth = 35;
    const logoHeight = 18;
    doc.addImage(
      logo,
      'PNG',
      SPACING.MARGIN,
      (SPACING.TOP - logoHeight) / 2,
      logoWidth,
      logoHeight
    );
  } catch (error) {
    console.error('Erro ao carregar logo:', error);
  }

  doc.setTextColor(COLORS.WHITE[0], COLORS.WHITE[1], COLORS.WHITE[2]);
  doc.setFontSize(FONTS.TITLE);
  doc.text(config.title, SPACING.MARGIN + 40, SPACING.TOP/2 + 5);

  return SPACING.TOP + 10;
};

const addUsinaInfo = (doc: jsPDF, data: BoletimMedicaoData, yPos: number): number => {
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

const addCharts = async (doc: jsPDF, data: BoletimMedicaoData, yPos: number): Promise<number> => {
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

const addDataTable = (doc: jsPDF, data: BoletimMedicaoData, yPos: number): number => {
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

export const generateBoletimPdf = async (data: BoletimMedicaoData): Promise<{ doc: jsPDF, fileName: string }> => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  let yPos = 0;

  doc.setFontSize(FONTS.TITLE);
  doc.text("Cooperativa Cogesol", SPACING.PAGE.WIDTH/2, 20, { align: "center" });
  doc.setFontSize(FONTS.NORMAL);
  doc.text("CNPJ: 57.658.963/0001-02", SPACING.PAGE.WIDTH/2, 30, { align: "center" });
  
  doc.setFillColor(240, 249, 255);
  doc.rect(SPACING.PAGE.WIDTH - 80, 40, 60, 25, 'F');
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text("Mês de Referência", SPACING.PAGE.WIDTH - 75, 50);
  doc.setFontSize(FONTS.NORMAL);
  doc.text(format(data.data_emissao, 'MMM/yy', { locale: ptBR }).toLowerCase(), SPACING.PAGE.WIDTH - 75, 58);

  yPos = 70;

  yPos = addUsinaInfo(doc, data, yPos);
  yPos = await addCharts(doc, data, yPos);
  yPos = addDataTable(doc, data, yPos);

  const fileName = `boletim-medicao-${data.usina.numero_uc}-${format(new Date(), 'MM-yyyy')}.pdf`;

  return { doc, fileName };
};
