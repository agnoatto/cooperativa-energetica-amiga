
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
import { usePagamentosHistorico } from '../pagamentos/hooks/usePagamentosHistorico';

interface BoletimPDFProps {
  pagamento: PagamentoData;
}

export const BoletimPDF: React.FC<BoletimPDFProps> = ({ pagamento }) => {
  const { getPagamentosUltimos12Meses } = usePagamentosHistorico();
  const [historicoData, setHistoricoData] = React.useState<PagamentoData[]>([]);

  React.useEffect(() => {
    const carregarHistorico = async () => {
      const historico = await getPagamentosUltimos12Meses(pagamento);
      setHistoricoData(historico);
    };
    carregarHistorico();
  }, [pagamento, getPagamentosUltimos12Meses]);

  const valorKwh = pagamento.usina?.valor_kwh || 0;
  const valorBruto = valorKwh * pagamento.geracao_kwh;
  const valorEfetivo = valorBruto - pagamento.valor_tusd_fio_b - pagamento.valor_concessionaria;
  
  const headerInfo = {
    title: "Boletim de Medição",
    subtitle: format(new Date(pagamento.ano, pagamento.mes - 1), 'MMMM/yyyy', { locale: ptBR }),
    documentNumber: pagamento.usina?.unidade_usina?.numero_uc || '',
  };

  const infoItems = [
    { label: "Investidor", value: pagamento.usina?.investidor?.nome_investidor || '' },
    { label: "Unidade Consumidora", value: pagamento.usina?.unidade_usina?.numero_uc || '' },
    { label: "Data de Emissão", value: format(new Date(pagamento.data_emissao || new Date()), 'dd/MM/yyyy', { locale: ptBR }) },
  ];

  const valoresItems = [
    { label: "Geração (kWh)", value: pagamento.geracao_kwh.toString() },
    { label: "Valor do kWh", value: `R$ ${valorKwh.toFixed(4)}` },
    { label: "Valor Bruto", value: `R$ ${valorBruto.toFixed(2)}` },
    { label: "TUSD Fio B", value: `R$ ${pagamento.valor_tusd_fio_b.toFixed(2)}` },
    { label: "Fatura Concessionária", value: `R$ ${pagamento.valor_concessionaria.toFixed(2)}` },
    { label: "Valor Líquido", value: `R$ ${valorEfetivo.toFixed(2)}` },
  ];

  const historicoColumns = [
    { header: "Mês/Ano", accessor: "mesAno", width: "15%" },
    { header: "Geração (kWh)", accessor: "geracao_kwh", width: "15%" },
    { header: "Total Bruto", accessor: "valorBruto", width: "15%", format: formatCurrency },
    { header: "Retenção Fio B", accessor: "valor_tusd_fio_b", width: "15%", format: formatCurrency },
    { header: "Fatura Concessionária", accessor: "valor_concessionaria", width: "20%", format: formatCurrency },
    { header: "Recebimento Líquido", accessor: "valorLiquido", width: "20%", format: formatCurrency },
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Valores</Text>
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
