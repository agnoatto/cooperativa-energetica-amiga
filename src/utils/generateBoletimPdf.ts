import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BoletimMedicaoData } from "@/components/pagamentos/types/boletim";
import { COLORS, FONTS, SPACING } from "./pdf/constants";
import { formatCurrency } from "./pdfUtils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const generateChartImage = async (data: any[], config: { 
  width: number;
  height: number;
  dataKey: string;
  yAxisLabel: string;
  formatter?: (value: number) => string;
}) => {
  const chartRef = document.createElement('div');
  chartRef.style.width = `${config.width}px`;
  chartRef.style.height = `${config.height}px`;
  document.body.appendChild(chartRef);

  const chart = (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis 
          label={{ 
            value: config.yAxisLabel, 
            angle: -90, 
            position: 'insideLeft' 
          }}
          tickFormatter={config.formatter}
        />
        <Tooltip formatter={config.formatter} />
        <Bar dataKey={config.dataKey} fill="#0EA5E9" />
      </BarChart>
    </ResponsiveContainer>
  );

  // Convert chart to canvas
  const canvas = await html2canvas(chartRef);
  document.body.removeChild(chartRef);
  return canvas.toDataURL('image/png');
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
  // Prepare data for last 12 months
  const last12Months = data.pagamentos
    .slice(-12)
    .map(p => ({
      name: format(new Date(p.ano, p.mes - 1), 'MMM/yy', { locale: ptBR }),
      geracao: p.geracao_kwh,
      valor: p.valor_total
    }));

  // Generation Chart
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text("Geração (kWh/mês)", SPACING.MARGIN, yPos);
  
  const geracaoChart = await generateChartImage(last12Months, {
    width: 500,
    height: 200,
    dataKey: "geracao",
    yAxisLabel: "kWh",
    formatter: (value: number) => value.toLocaleString('pt-BR')
  });
  
  doc.addImage(
    geracaoChart,
    'PNG',
    SPACING.MARGIN,
    yPos + 10,
    SPACING.PAGE.CONTENT_WIDTH,
    80
  );

  // Payments Chart
  yPos += 100;
  doc.text("Recebimentos (R$)", SPACING.MARGIN, yPos);
  
  const recebimentosChart = await generateChartImage(last12Months, {
    width: 500,
    height: 200,
    dataKey: "valor",
    yAxisLabel: "R$",
    formatter: (value: number) => formatCurrency(value)
  });
  
  doc.addImage(
    recebimentosChart,
    'PNG',
    SPACING.MARGIN,
    yPos + 10,
    SPACING.PAGE.CONTENT_WIDTH,
    80
  );

  return yPos + 100;
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

  const rows = data.pagamentos.map(pagamento => [
    format(new Date(pagamento.ano, pagamento.mes - 1), 'MMM/yyyy', { locale: ptBR }),
    pagamento.geracao_kwh.toString(),
    formatCurrency(pagamento.tusd_fio_b || 0),
    formatCurrency(pagamento.valor_concessionaria),
    formatCurrency(pagamento.valor_total)
  ]);

  // Configurar a tabela
  doc.setFontSize(FONTS.SMALL);
  const cellPadding = 3;
  const cellHeight = 8;
  const columnWidth = (SPACING.PAGE.CONTENT_WIDTH) / headers.length;

  // Cabeçalho da tabela
  headers.forEach((header, index) => {
    doc.text(header, SPACING.MARGIN + (columnWidth * index), yPos + 10);
  });

  // Linhas da tabela
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

export const generateBoletimPdf = async (data: BoletimMedicaoData): Promise<{ doc: jsPDF, fileName: string }> => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  let yPos = 0;

  // Header with company info
  doc.setFontSize(FONTS.TITLE);
  doc.text("Cooperativa Cogesol", SPACING.PAGE.WIDTH/2, 20, { align: "center" });
  doc.setFontSize(FONTS.NORMAL);
  doc.text("CNPJ: 57.658.963/0001-02", SPACING.PAGE.WIDTH/2, 30, { align: "center" });
  
  // Reference month
  doc.setFillColor(240, 249, 255);
  doc.rect(SPACING.PAGE.WIDTH - 80, 40, 60, 20, 'F');
  doc.text("Mês de Referência", SPACING.PAGE.WIDTH - 75, 50);
  doc.text(format(data.data_emissao, 'MMM/yy', { locale: ptBR }), SPACING.PAGE.WIDTH - 75, 55);

  yPos = 70;

  // Usina Info
  yPos = addUsinaInfo(doc, data, yPos);

  // Charts
  yPos = await addCharts(doc, data, yPos);

  // Data Table
  yPos = addDataTable(doc, data, yPos);

  // Nome do arquivo
  const fileName = `boletim-medicao-${data.usina.numero_uc}-${format(new Date(), 'MM-yyyy')}.pdf`;

  return { doc, fileName };
};
