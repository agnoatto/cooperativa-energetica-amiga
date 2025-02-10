
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BoletimMedicaoData } from "@/components/pagamentos/types/boletim";
import { COLORS, FONTS, SPACING } from "./pdf/constants";
import { formatCurrency } from "./pdfUtils";

export const generateBoletimPdf = async (data: BoletimMedicaoData): Promise<{ doc: jsPDF, fileName: string }> => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  let yPos = 0;

  // Adicionar cabeçalho
  yPos = await addHeader(doc, {
    title: "Boletim de Medição",
    logoPath: '/lovable-uploads/254317ca-d03e-40a5-9286-a175e9dd8bbf.png'
  });

  // Informações da Usina
  yPos = addUsinaInfo(doc, data, yPos);

  // Adicionar gráficos
  yPos = await addCharts(doc, data, yPos);

  // Adicionar tabela de dados
  yPos = addDataTable(doc, data, yPos);

  // Nome do arquivo
  const fileName = `boletim-medicao-${data.usina.numero_uc}-${format(new Date(), 'MM-yyyy')}.pdf`;

  return { doc, fileName };
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
  // Esta função será implementada quando adicionarmos os gráficos
  return yPos + 80; // Espaço reservado para os gráficos
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
