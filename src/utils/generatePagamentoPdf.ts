
import { jsPDF } from "jspdf";
import { format, isValid } from "date-fns";
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

const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'Não informada';
  
  const date = new Date(dateString);
  if (!isValid(date)) return 'Data inválida';
  
  return format(date, 'dd/MM/yyyy');
};

export const generatePagamentoPdf = async (pagamento: PagamentoPdfData) => {
  try {
    const doc = new jsPDF();
    let yPos = 20;

    // Cabeçalho
    doc.setFontSize(20);
    doc.text("Recibo de Pagamento", 20, yPos);
    
    yPos += 20;
    doc.setFontSize(12);
    
    const competencia = new Date(pagamento.ano, pagamento.mes - 1);
    doc.text(
      `Competência: ${isValid(competencia) ? format(competencia, 'MMMM/yyyy', { locale: ptBR }) : 'Inválida'}`,
      20,
      yPos
    );
    
    yPos += 10;
    doc.text(`Unidade Consumidora: ${pagamento.usina.unidade_usina.numero_uc || 'Não informada'}`, 20, yPos);
    
    yPos += 10;
    doc.text(`Investidor: ${pagamento.usina.investidor.nome_investidor || 'Não informado'}`, 20, yPos);
    
    yPos += 20;
    doc.text("Detalhamento", 20, yPos);
    
    yPos += 10;
    doc.text(`Geração: ${pagamento.geracao_kwh || 0} kWh`, 20, yPos);
    
    yPos += 10;
    doc.text(`TUSD Fio B: ${formatCurrency(pagamento.valor_tusd_fio_b || 0)}`, 20, yPos);
    
    yPos += 10;
    doc.text(`Conta de Energia: ${formatCurrency(pagamento.conta_energia || 0)}`, 20, yPos);
    
    yPos += 10;
    doc.text(`Valor Total: ${formatCurrency(pagamento.valor_total || 0)}`, 20, yPos);
    
    yPos += 20;
    const statusFormatado = pagamento.status ? 
      pagamento.status.charAt(0).toUpperCase() + pagamento.status.slice(1) :
      'Não informado';
    doc.text(`Status: ${statusFormatado}`, 20, yPos);
    
    yPos += 10;
    doc.text(`Data de Vencimento: ${formatDate(pagamento.data_vencimento)}`, 20, yPos);
    
    if (pagamento.data_pagamento) {
      yPos += 10;
      doc.text(`Data de Pagamento: ${formatDate(pagamento.data_pagamento)}`, 20, yPos);
    }

    // Salvar o PDF com nome seguro
    const nomeArquivo = `pagamento-${pagamento.usina.unidade_usina.numero_uc || 'sem-uc'}-${pagamento.mes || '00'}-${pagamento.ano || '0000'}.pdf`;
    doc.save(nomeArquivo);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw new Error('Não foi possível gerar o PDF. Verifique os dados do pagamento.');
  }
};
