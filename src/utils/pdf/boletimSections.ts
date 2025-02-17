
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BoletimData } from "@/components/pagamentos/types/boletim";
import { COLORS, FONTS, SPACING } from "./constants";
import { formatCurrency } from "../formatters";

export const addUsinaInfo = (doc: jsPDF, data: BoletimData, yPos: number): number => {
  doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
  doc.setFontSize(FONTS.NORMAL);

  const info = [
    { label: "Nome da Usina:", value: data.usina.nome_investidor },
    { label: "UC:", value: data.usina.numero_uc },
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

export const addDataTable = (doc: jsPDF, data: BoletimData, yPos: number): number => {
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text("Histórico de Medição e Faturamento", SPACING.MARGIN, yPos);

  const headers = [
    "Mês/Ano",
    "Geração (kWh)",
    "TUSD FIO B",
    "Valor TUSD",
    "Valor Conc.",
    "Valor Total"
  ];

  // Configuração das colunas
  const columnWidths = {
    mesAno: 30,
    geracao: 30,
    tusdFioB: 30,
    valorTusd: 30,
    valorConc: 30,
    valorTotal: 30
  };

  const startX = SPACING.MARGIN;
  const tableWidth = Object.values(columnWidths).reduce((a, b) => a + b, 0);
  const cellHeight = 10;
  let currentY = yPos + 10;

  // Função helper para desenhar células
  const drawCell = (text: string, x: number, width: number, align: 'left' | 'right' = 'left') => {
    const textX = align === 'right' ? x + width - 2 : x + 2;
    doc.text(text, textX, currentY + 6, { align });
  };

  // Cabeçalho da tabela
  doc.setFillColor(240, 240, 240);
  doc.rect(startX, currentY, tableWidth, cellHeight, 'F');
  doc.setFont("helvetica", "bold");

  let currentX = startX;
  headers.forEach((header, index) => {
    const width = Object.values(columnWidths)[index];
    drawCell(header, currentX, width);
    currentX += width;
  });

  // Ordenar pagamentos por data (mais recentes primeiro)
  const sortedPagamentos = [...data.pagamentos].sort((a, b) => {
    if (a.ano !== b.ano) return b.ano - a.ano;
    return b.mes - a.mes;
  });

  // Dados da tabela
  doc.setFont("helvetica", "normal");
  const rows = sortedPagamentos.map(pagamento => ({
    mesAno: format(new Date(pagamento.ano, pagamento.mes - 1), 'MMM/yyyy', { locale: ptBR }),
    geracao: pagamento.geracao_kwh.toLocaleString('pt-BR'),
    tusdFioB: pagamento.tusd_fio_b?.toLocaleString('pt-BR') ?? '-',
    valorTusd: formatCurrency(pagamento.valor_tusd_fio_b),
    valorConc: formatCurrency(pagamento.valor_concessionaria),
    valorTotal: formatCurrency(pagamento.valor_total)
  }));

  // Totais
  const totals = sortedPagamentos.reduce((acc, pagamento) => ({
    geracao: acc.geracao + pagamento.geracao_kwh,
    tusdFioB: (acc.tusdFioB || 0) + (pagamento.tusd_fio_b || 0),
    valorTusd: acc.valorTusd + pagamento.valor_tusd_fio_b,
    valorConc: acc.valorConc + pagamento.valor_concessionaria,
    valorTotal: acc.valorTotal + pagamento.valor_total
  }), { 
    geracao: 0, 
    tusdFioB: 0,
    valorTusd: 0,
    valorConc: 0,
    valorTotal: 0 
  });

  // Adiciona linhas de dados
  rows.forEach((row, rowIndex) => {
    currentY += cellHeight;
    
    // Fundo alternado
    if (rowIndex % 2 === 0) {
      doc.setFillColor(248, 248, 248);
      doc.rect(startX, currentY, tableWidth, cellHeight, 'F');
    }

    currentX = startX;
    drawCell(row.mesAno, currentX, columnWidths.mesAno);
    currentX += columnWidths.mesAno;
    drawCell(row.geracao, currentX, columnWidths.geracao, 'right');
    currentX += columnWidths.geracao;
    drawCell(row.tusdFioB, currentX, columnWidths.tusdFioB, 'right');
    currentX += columnWidths.tusdFioB;
    drawCell(row.valorTusd, currentX, columnWidths.valorTusd, 'right');
    currentX += columnWidths.valorTusd;
    drawCell(row.valorConc, currentX, columnWidths.valorConc, 'right');
    currentX += columnWidths.valorConc;
    drawCell(row.valorTotal, currentX, columnWidths.valorTotal, 'right');
  });

  // Linha de totais
  currentY += cellHeight;
  doc.setFillColor(240, 249, 255);
  doc.rect(startX, currentY, tableWidth, cellHeight, 'F');
  doc.setFont("helvetica", "bold");

  currentX = startX;
  drawCell("TOTAL", currentX, columnWidths.mesAno);
  currentX += columnWidths.mesAno;
  drawCell(totals.geracao.toLocaleString('pt-BR'), currentX, columnWidths.geracao, 'right');
  currentX += columnWidths.geracao;
  drawCell(totals.tusdFioB.toLocaleString('pt-BR'), currentX, columnWidths.tusdFioB, 'right');
  currentX += columnWidths.tusdFioB;
  drawCell(formatCurrency(totals.valorTusd), currentX, columnWidths.valorTusd, 'right');
  currentX += columnWidths.valorTusd;
  drawCell(formatCurrency(totals.valorConc), currentX, columnWidths.valorConc, 'right');
  currentX += columnWidths.valorConc;
  drawCell(formatCurrency(totals.valorTotal), currentX, columnWidths.valorTotal, 'right');

  // Borda da tabela
  doc.setDrawColor(220, 220, 220);
  doc.rect(startX, yPos + 10, tableWidth, (rows.length + 2) * cellHeight, 'S');

  // Linhas verticais internas
  currentX = startX;
  for (let i = 0; i < Object.keys(columnWidths).length - 1; i++) {
    currentX += Object.values(columnWidths)[i];
    doc.line(
      currentX,
      yPos + 10,
      currentX,
      yPos + 10 + ((rows.length + 2) * cellHeight)
    );
  }

  // Linhas horizontais
  for (let i = 1; i < rows.length + 2; i++) {
    const lineY = yPos + 10 + (i * cellHeight);
    doc.line(startX, lineY, startX + tableWidth, lineY);
  }

  return currentY + cellHeight + 10;
};
