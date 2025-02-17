
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

  // Configuração das colunas
  const columnWidths = {
    mesAno: 25,
    geracao: 30,
    tusd: 30,
    bruto: 30,
    conc: 30,
    liquido: 30
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
  const rows = sortedPagamentos.map(pagamento => {
    const valorBruto = (pagamento.geracao_kwh * data.usina.valor_kwh) - 
                      ((pagamento.tusd_fio_b || 0) * pagamento.geracao_kwh);
    return {
      mesAno: format(new Date(pagamento.ano, pagamento.mes - 1), 'MMM/yyyy', { locale: ptBR }),
      geracao: pagamento.geracao_kwh.toLocaleString('pt-BR'),
      tusd: formatCurrency(pagamento.tusd_fio_b ? pagamento.tusd_fio_b * pagamento.geracao_kwh : 0),
      bruto: formatCurrency(valorBruto),
      conc: formatCurrency(pagamento.valor_concessionaria),
      liquido: formatCurrency(pagamento.valor_total)
    };
  });

  // Totais
  const totals = sortedPagamentos.reduce((acc, pagamento) => {
    const valorBruto = (pagamento.geracao_kwh * data.usina.valor_kwh) - 
                      ((pagamento.tusd_fio_b || 0) * pagamento.geracao_kwh);
    return {
      geracao: acc.geracao + pagamento.geracao_kwh,
      tusd: acc.tusd + (pagamento.tusd_fio_b || 0) * pagamento.geracao_kwh,
      bruto: acc.bruto + valorBruto,
      conc: acc.conc + pagamento.valor_concessionaria,
      liquido: acc.liquido + pagamento.valor_total
    };
  }, { geracao: 0, tusd: 0, bruto: 0, conc: 0, liquido: 0 });

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
    drawCell(row.tusd, currentX, columnWidths.tusd, 'right');
    currentX += columnWidths.tusd;
    drawCell(row.bruto, currentX, columnWidths.bruto, 'right');
    currentX += columnWidths.bruto;
    drawCell(row.conc, currentX, columnWidths.conc, 'right');
    currentX += columnWidths.conc;
    drawCell(row.liquido, currentX, columnWidths.liquido, 'right');
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
  drawCell(formatCurrency(totals.tusd), currentX, columnWidths.tusd, 'right');
  currentX += columnWidths.tusd;
  drawCell(formatCurrency(totals.bruto), currentX, columnWidths.bruto, 'right');
  currentX += columnWidths.bruto;
  drawCell(formatCurrency(totals.conc), currentX, columnWidths.conc, 'right');
  currentX += columnWidths.conc;
  drawCell(formatCurrency(totals.liquido), currentX, columnWidths.liquido, 'right');

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
