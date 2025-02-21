
import React from 'react';
import { Document, Page, View, Text } from '@react-pdf/renderer';
import { PDFHeader } from './components/PDFHeader';
import { PDFInfoBox } from './components/PDFInfoBox';
import { PDFTable } from './components/PDFTable';
import { styles } from './theme';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PagamentoData } from '../pagamentos/types/pagamento';
import { formatCurrency } from '../pdf/components/PDFTable';

interface BoletimPDFProps {
  pagamento: PagamentoData;
  historicoData: PagamentoData[];
}

export const BoletimPDF: React.FC<BoletimPDFProps> = ({ pagamento, historicoData }) => {
  const valorKwh = pagamento.usina?.valor_kwh || 0;
  const valorBruto = valorKwh * pagamento.geracao_kwh;
  const valorEfetivo = valorBruto - pagamento.valor_tusd_fio_b - pagamento.valor_concessionaria;
  
  const mesReferencia = format(new Date(pagamento.ano, pagamento.mes - 1), 'MMMM/yyyy', { locale: ptBR });
  
  const headerInfo = {
    title: `Boletim de Medição - ${mesReferencia}`,
    subtitle: `Referência: ${mesReferencia}`,
    documentNumber: pagamento.usina?.unidade_usina?.numero_uc || '',
  };

  const infoItems = [
    { label: "Investidor", value: pagamento.usina?.investidor?.nome_investidor || '' },
    { label: "Unidade Consumidora", value: pagamento.usina?.unidade_usina?.numero_uc || '' },
    { label: "Data de Emissão", value: format(new Date(pagamento.data_emissao || new Date()), 'dd/MM/yyyy', { locale: ptBR }) },
  ];

  const valoresItems = [
    { 
      label: "Geração (kWh)", 
      value: pagamento.geracao_kwh.toString(),
      highlight: true
    },
    { 
      label: "Valor do kWh", 
      value: formatCurrency(valorKwh),
      highlight: true
    },
    { 
      label: "Valor Bruto", 
      value: formatCurrency(valorBruto),
      highlight: true
    },
    { 
      label: "TUSD Fio B", 
      value: formatCurrency(pagamento.valor_tusd_fio_b),
      highlight: true
    },
    { 
      label: "Fatura Concessionária", 
      value: formatCurrency(pagamento.valor_concessionaria),
      highlight: true
    },
    { 
      label: "Valor Líquido", 
      value: formatCurrency(valorEfetivo),
      highlight: true,
      bold: true
    },
    {
      label: "Previsão de Pagamento",
      value: pagamento.data_vencimento ? format(new Date(pagamento.data_vencimento), 'dd/MM/yyyy', { locale: ptBR }) : '-',
      highlight: true,
      bold: true
    }
  ];

  const historicoColumns = [
    { header: "Mês/Ano", accessor: "mesAno", width: "12%" },
    { header: "Geração (kWh)", accessor: "geracao_kwh", width: "12%" },
    { header: "Total Bruto", accessor: "valorBruto", width: "12%", format: formatCurrency },
    { header: "Retenção Fio B", accessor: "valor_tusd_fio_b", width: "12%", format: formatCurrency },
    { header: "Fatura Concessionária", accessor: "valor_concessionaria", width: "12%", format: formatCurrency },
    { header: "Recebimento Líquido", accessor: "valorLiquido", width: "15%", format: formatCurrency },
    { header: "Data Pagamento", accessor: "dataPagamento", width: "15%" },
    { header: "Status", accessor: "status", width: "10%" }
  ];

  const historicoTableData = historicoData.map(historico => {
    const valorBrutoHistorico = historico.geracao_kwh * (historico.usina?.valor_kwh || 0);
    const valorLiquido = valorBrutoHistorico - historico.valor_tusd_fio_b - historico.valor_concessionaria;

    return {
      mesAno: format(new Date(historico.ano, historico.mes - 1), 'MMMM/yyyy', { locale: ptBR }),
      geracao_kwh: historico.geracao_kwh,
      valorBruto: valorBrutoHistorico,
      valor_tusd_fio_b: historico.valor_tusd_fio_b,
      valor_concessionaria: historico.valor_concessionaria,
      valorLiquido: valorLiquido,
      dataPagamento: historico.data_pagamento 
        ? format(new Date(historico.data_pagamento), 'dd/MM/yyyy', { locale: ptBR }) 
        : '-',
      status: historico.status
    };
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <PDFHeader {...headerInfo} />
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Gerais</Text>
          <PDFInfoBox items={infoItems} />
        </View>

        <View style={[styles.section, { backgroundColor: '#f8f9fa' }]}>
          <Text style={[styles.sectionTitle, { fontSize: 14, color: '#1a1f2c' }]}>Valores</Text>
          <PDFInfoBox items={valoresItems} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Histórico dos Últimos 12 Meses</Text>
          <PDFTable columns={historicoColumns} data={historicoTableData} />
        </View>

        {pagamento.observacao && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observações</Text>
            <Text style={styles.text}>{pagamento.observacao}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};
