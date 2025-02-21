
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PagamentoPdfData {
  geracao_kwh: number;
  valor_tusd_fio_b: number;
  conta_energia: number;
  valor_total: number;
  status: string;
  data_vencimento: string;
  data_pagamento: string;
  mes: number;
  ano: number;
  usina: {
    unidade_usina: {
      numero_uc: string;
    };
    investidor: {
      nome_investidor: string;
    };
  };
}

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

export const generatePagamentoPdf = async (pagamento: PagamentoPdfData) => {
  const doc = new jsPDF();
  let yPos = 20;

  // Cabeçalho
  doc.setFontSize(20);
  doc.text("Recibo de Pagamento", 20, yPos);
  
  yPos += 20;
  doc.setFontSize(12);
  doc.text(`Competência: ${format(new Date(pagamento.ano, pagamento.mes - 1), 'MMMM/yyyy', { locale: ptBR })}`, 20, yPos);
  
  yPos += 10;
  doc.text(`Unidade Consumidora: ${pagamento.usina.unidade_usina.numero_uc}`, 20, yPos);
  
  yPos += 10;
  doc.text(`Investidor: ${pagamento.usina.investidor.nome_investidor}`, 20, yPos);
  
  yPos += 20;
  doc.text("Detalhamento", 20, yPos);
  
  yPos += 10;
  doc.text(`Geração: ${pagamento.geracao_kwh} kWh`, 20, yPos);
  
  yPos += 10;
  doc.text(`TUSD Fio B: ${formatCurrency(pagamento.valor_tusd_fio_b)}`, 20, yPos);
  
  yPos += 10;
  doc.text(`Conta de Energia: ${formatCurrency(pagamento.conta_energia)}`, 20, yPos);
  
  yPos += 10;
  doc.text(`Valor Total: ${formatCurrency(pagamento.valor_total)}`, 20, yPos);
  
  yPos += 20;
  doc.text(`Status: ${pagamento.status.charAt(0).toUpperCase() + pagamento.status.slice(1)}`, 20, yPos);
  
  yPos += 10;
  doc.text(`Data de Vencimento: ${format(new Date(pagamento.data_vencimento), 'dd/MM/yyyy')}`, 20, yPos);
  
  if (pagamento.data_pagamento) {
    yPos += 10;
    doc.text(`Data de Pagamento: ${format(new Date(pagamento.data_pagamento), 'dd/MM/yyyy')}`, 20, yPos);
  }

  // Salvar o PDF
  doc.save(`pagamento-${pagamento.usina.unidade_usina.numero_uc}-${pagamento.mes}-${pagamento.ano}.pdf`);
};
