
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { PagamentoData } from '@/components/pagamentos/types/pagamento';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export async function generateBoletimPdf(pagamento: PagamentoData) {
  const doc = new jsPDF();

  // Cabeçalho
  doc.setFontSize(18);
  doc.text('Boletim de Pagamento', 14, 22);

  // Informações Gerais
  doc.setFontSize(12);
  doc.text(`UC: ${pagamento.usina.unidade_usina.numero_uc}`, 14, 30);
  doc.text(`Investidor: ${pagamento.usina.investidor.nome_investidor}`, 14, 38);
  doc.text(`Mês/Ano: ${pagamento.mes}/${pagamento.ano}`, 14, 46);

  // Detalhes do Pagamento
  const dataEmissaoFormatada = pagamento.data_emissao
    ? format(new Date(pagamento.data_emissao), 'dd/MM/yyyy', { locale: ptBR })
    : 'Não informada';

  const dataVencimentoFormatada = pagamento.data_vencimento
    ? format(new Date(pagamento.data_vencimento), 'dd/MM/yyyy', { locale: ptBR })
    : 'Não informada';

  const dataPagamentoFormatada = pagamento.data_pagamento
    ? format(new Date(pagamento.data_pagamento), 'dd/MM/yyyy', { locale: ptBR })
    : 'Não informada';

  doc.text(`Data de Emissão: ${dataEmissaoFormatada}`, 105, 30);
  doc.text(`Data de Vencimento: ${dataVencimentoFormatada}`, 105, 38);
  doc.text(`Data de Pagamento: ${dataPagamentoFormatada}`, 105, 46);

  // Valores
  doc.text(`Geração (kWh): ${pagamento.geracao_kwh}`, 14, 62);
  doc.text(`TUSD Fio B: ${pagamento.tusd_fio_b}`, 14, 70);
  doc.text(`Valor TUSD Fio B: ${pagamento.valor_tusd_fio_b}`, 14, 78);
  doc.text(`Valor Concessionária: ${pagamento.valor_concessionaria}`, 105, 62);
  doc.text(`Valor Total: ${pagamento.valor_total}`, 105, 70);

  // Observações
  doc.text('Observações:', 14, 94);
  const observacao = pagamento.observacao || 'Nenhuma observação.';
  const lineHeight = 6;
  let y = 100;
  const maxWidth = 180;

  const observacoes = doc.splitTextToSize(observacao, maxWidth);
  observacoes.forEach(obs => {
    doc.text(obs, 14, y);
    y += lineHeight;
  });

  // Observações de Pagamento
  doc.text('Observações de Pagamento:', 14, y + 10);
  const observacaoPagamento = pagamento.observacao_pagamento || 'Nenhuma observação de pagamento.';
  y += 16;
  const observacoesPagamento = doc.splitTextToSize(observacaoPagamento, maxWidth);
  observacoesPagamento.forEach(obs => {
    doc.text(obs, 14, y);
    y += lineHeight;
  });

  // Atualizar referências ao arquivo da conta de energia
  const arquivoPath = pagamento.arquivo_conta_energia_path;
  const arquivoNome = pagamento.arquivo_conta_energia_nome;

  if (arquivoPath && arquivoNome) {
    doc.text(`Arquivo da Conta de Energia: ${arquivoNome}`, 14, y + 10);
  } else {
    doc.text('Arquivo da Conta de Energia: Não anexado', 14, y + 10);
  }

  // Rodapé
  doc.setFontSize(10);
  doc.text('Gerado por [Nome da Aplicação]', 14, 290);
  doc.text(format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR }), 170, 290);

  const fileName = `boletim_pagamento_${pagamento.mes}_${pagamento.ano}.pdf`;

  return { doc, fileName };
}
