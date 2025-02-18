
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
    { label: "Data de Emissão:", value: format(new Date(data.data_emissao), 'dd/MM/yyyy') },
    { label: "Data de Vencimento:", value: format(new Date(data.data_vencimento), 'dd/MM/yyyy') },
  ];

  info.forEach((item, index) => {
    const y = yPos + (index * 7);
    doc.text(item.label, SPACING.MARGIN, y);
    doc.text(item.value, SPACING.MARGIN + 50, y);
  });

  return yPos + (info.length * 7) + 10;
};

export const addDataTable = (doc: jsPDF, data: BoletimData, yPos: number): number => {
  // Título da tabela
  doc.setFontSize(FONTS.SUBTITLE);
  doc.text("Histórico de Medição e Faturamento", SPACING.MARGIN, yPos);
  yPos += 10;

  // Definição das colunas
  const columns = [
    { id: 'mesAno', header: 'Mês/Ano', width: 30, align: 'left' as const },
    { id: 'geracao', header: 'Geração (kWh)', width: 35, align: 'right' as const },
    { id: 'valorTusd', header: 'Valor TUSD', width: 35, align: 'right' as const },
    { id: 'valorConc', header: 'Valor Conc.', width: 35, align: 'right' as const },
    { id: 'valorTotal', header: 'Valor Total', width: 35, align: 'right' as const }
  ];

  // Configurações da tabela
  const tableWidth = columns.reduce((sum, col) => sum + col.width, 0);
  const rowHeight = 8;
  const startX = SPACING.MARGIN;
  let currentY = yPos;

  // Função helper para desenhar células
  const drawCell = (text: string, x: number, width: number, align: 'left' | 'right' = 'left') => {
    const padding = 2;
    const textX = align === 'right' ? x + width - padding : x + padding;
    doc.text(text, textX, currentY + 6, { align });
  };

  // Cabeçalho da tabela
  doc.setFillColor(240, 240, 240);
  doc.rect(startX, currentY, tableWidth, rowHeight, 'F');
  doc.setFont("helvetica", "bold");

  let currentX = startX;
  columns.forEach(column => {
    drawCell(column.header, currentX, column.width, column.align);
    currentX += column.width;
  });

  // Dados da tabela
  doc.setFont("helvetica", "normal");
  const rows = data.pagamentos.map(pagamento => ({
    mesAno: format(new Date(pagamento.ano, pagamento.mes - 1), 'MMM/yyyy', { locale: ptBR }),
    geracao: pagamento.geracao_kwh.toLocaleString('pt-BR'),
    valorTusd: formatCurrency(pagamento.valor_tusd_fio_b),
    valorConc: formatCurrency(pagamento.valor_concessionaria),
    valorTotal: formatCurrency(pagamento.valor_total)
  }));

  // Totais
  const totals = data.pagamentos.reduce((acc, pagamento) => ({
    geracao: acc.geracao + pagamento.geracao_kwh,
    valorTusd: acc.valorTusd + pagamento.valor_tusd_fio_b,
    valorConc: acc.valorConc + pagamento.valor_concessionaria,
    valorTotal: acc.valorTotal + pagamento.valor_total
  }), { 
    geracao: 0,
    valorTusd: 0,
    valorConc: 0,
    valorTotal: 0 
  });

  // Renderizar linhas de dados
  rows.forEach((row, rowIndex) => {
    currentY += rowHeight;
    
    // Fundo zebrado
    if (rowIndex % 2 === 0) {
      doc.setFillColor(248, 248, 248);
      doc.rect(startX, currentY, tableWidth, rowHeight, 'F');
    }

    // Desenhar células
    currentX = startX;
    columns.forEach(column => {
      const value = row[column.id as keyof typeof row];
      drawCell(value, currentX, column.width, column.align);
      currentX += column.width;
    });
  });

  // Linha de totais
  currentY += rowHeight;
  doc.setFillColor(240, 249, 255);
  doc.rect(startX, currentY, tableWidth, rowHeight, 'F');
  doc.setFont("helvetica", "bold");

  // Desenhar totais
  currentX = startX;
  columns.forEach((column, index) => {
    let value = '';
    if (index === 0) value = 'TOTAL';
    else if (column.id === 'geracao') value = totals.geracao.toLocaleString('pt-BR');
    else if (column.id === 'valorTusd') value = formatCurrency(totals.valorTusd);
    else if (column.id === 'valorConc') value = formatCurrency(totals.valorConc);
    else if (column.id === 'valorTotal') value = formatCurrency(totals.valorTotal);
    
    drawCell(value, currentX, column.width, column.align);
    currentX += column.width;
  });

  // Bordas e linhas da tabela
  doc.setDrawColor(220, 220, 220);
  
  // Borda externa
  doc.rect(startX, yPos, tableWidth, (rows.length + 2) * rowHeight, 'S');

  // Linhas verticais
  currentX = startX;
  columns.forEach(column => {
    currentX += column.width;
    if (currentX < startX + tableWidth) {
      doc.line(
        currentX,
        yPos,
        currentX,
        yPos + ((rows.length + 2) * rowHeight)
      );
    }
  });

  // Linhas horizontais
  for (let i = 1; i < rows.length + 2; i++) {
    const lineY = yPos + (i * rowHeight);
    doc.line(startX, lineY, startX + tableWidth, lineY);
  }

  return currentY + rowHeight + 10;
};
