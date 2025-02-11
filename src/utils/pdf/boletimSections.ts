
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BoletimMedicaoData } from "@/components/pagamentos/types/boletim";
import { COLORS, FONTS, SPACING } from "./constants";
import { formatCurrency } from "../pdfUtils";

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

export const addDataTable = (doc: jsPDF, data: BoletimMedicaoData, yPos: number): number => {
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text("Histórico de Medição e Faturamento", SPACING.MARGIN, yPos);

  const headers = [
    "Mês/Ano",
    "Geração (kWh)",
    "TUSD Fio B",
    "Valor Bruto",
    "Valor Conc.",
    "Valor Líquido"
  ];

  // Calcula os totais
  const totals = data.pagamentos.reduce((acc, pagamento) => {
    const valorBruto = (pagamento.geracao_kwh * data.usina.valor_kwh) - 
                      ((pagamento.tusd_fio_b || 0) * pagamento.geracao_kwh);
    return {
      geracao: acc.geracao + pagamento.geracao_kwh,
      tusd: acc.tusd + (pagamento.tusd_fio_b || 0) * pagamento.geracao_kwh,
      bruto: acc.bruto + valorBruto,
      concessionaria: acc.concessionaria + pagamento.valor_concessionaria,
      liquido: acc.liquido + pagamento.valor_total
    };
  }, {
    geracao: 0,
    tusd: 0,
    bruto: 0,
    concessionaria: 0,
    liquido: 0
  });

  const rows = data.pagamentos.slice(-12).map(pagamento => {
    const valorBruto = (pagamento.geracao_kwh * data.usina.valor_kwh) - 
                      ((pagamento.tusd_fio_b || 0) * pagamento.geracao_kwh);
    return [
      format(new Date(pagamento.ano, pagamento.mes - 1), 'MMM/yyyy', { locale: ptBR }),
      pagamento.geracao_kwh.toLocaleString('pt-BR'),
      formatCurrency(pagamento.tusd_fio_b ? pagamento.tusd_fio_b * pagamento.geracao_kwh : 0),
      formatCurrency(valorBruto),
      formatCurrency(pagamento.valor_concessionaria),
      formatCurrency(pagamento.valor_total)
    ];
  });

  // Adiciona linha de totais
  rows.push([
    'TOTAL',
    totals.geracao.toLocaleString('pt-BR'),
    formatCurrency(totals.tusd),
    formatCurrency(totals.bruto),
    formatCurrency(totals.concessionaria),
    formatCurrency(totals.liquido)
  ]);

  doc.setFontSize(FONTS.NORMAL);
  const cellPadding = 3;
  const cellHeight = 8;
  const columnWidths = [30, 25, 30, 30, 30, 30];
  let currentX = SPACING.MARGIN;
  let currentY = yPos + 10;

  // Desenha o cabeçalho com fundo
  doc.setFillColor(240, 240, 240);
  doc.rect(SPACING.MARGIN, currentY, SPACING.PAGE.CONTENT_WIDTH - 20, cellHeight, 'F');

  // Títulos das colunas
  doc.setFont("helvetica", "bold");
  headers.forEach((header, index) => {
    const xPos = currentX + (index === 0 ? 0 : columnWidths[index - 1]);
    doc.text(header, xPos + cellPadding, currentY + 6);
    currentX = xPos;
  });

  // Dados das linhas
  doc.setFont("helvetica", "normal");
  rows.forEach((row, rowIndex) => {
    currentY += cellHeight;
    currentX = SPACING.MARGIN;

    // Fundo alternado para as linhas
    if (rowIndex % 2 === 0) {
      doc.setFillColor(248, 248, 248);
      doc.rect(SPACING.MARGIN, currentY, SPACING.PAGE.CONTENT_WIDTH - 20, cellHeight, 'F');
    }

    // Destaque para a linha de totais
    if (rowIndex === rows.length - 1) {
      doc.setFillColor(240, 249, 255);
      doc.rect(SPACING.MARGIN, currentY, SPACING.PAGE.CONTENT_WIDTH - 20, cellHeight, 'F');
      doc.setFont("helvetica", "bold");
    }

    row.forEach((cell, cellIndex) => {
      const xPos = currentX + (cellIndex === 0 ? 0 : columnWidths[cellIndex - 1]);
      const align = cellIndex === 0 ? 'left' : 'right';
      const textX = align === 'right' ? 
        xPos + columnWidths[cellIndex] - cellPadding : 
        xPos + cellPadding;
      
      doc.text(cell.toString(), textX, currentY + 6, { align });
      currentX = xPos;
    });
  });

  // Borda externa da tabela
  doc.setDrawColor(220, 220, 220);
  doc.rect(
    SPACING.MARGIN,
    yPos + 10,
    SPACING.PAGE.CONTENT_WIDTH - 20,
    (rows.length + 1) * cellHeight,
    'S'
  );

  return currentY + cellHeight + 10;
};
