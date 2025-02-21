
import React from 'react';
import { Document, Page, View, Text } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { styles } from './theme';
import { PDFHeader } from './components/PDFHeader';
import { PDFInfoBox } from './components/PDFInfoBox';
import { PDFTable } from './components/PDFTable';
import { PagamentoData } from '../pagamentos/types/pagamento';

interface BoletimPDFProps {
  pagamento: PagamentoData;
}

export const BoletimPDF: React.FC<BoletimPDFProps> = ({ pagamento }) => {
  const formatarData = (data: string | null) => {
    return data ? format(new Date(data), 'dd/MM/yyyy', { locale: ptBR }) : 'Não informada';
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const infoGerais = [
    { label: 'UC', value: pagamento.usina.unidade_usina.numero_uc },
    { label: 'Investidor', value: pagamento.usina.investidor.nome_investidor },
    { label: 'Mês/Ano', value: `${pagamento.mes}/${pagamento.ano}` },
  ];

  const infoDatas = [
    { label: 'Data de Emissão', value: formatarData(pagamento.data_emissao) },
    { label: 'Data de Vencimento', value: formatarData(pagamento.data_vencimento) },
    { label: 'Data de Pagamento', value: formatarData(pagamento.data_pagamento) },
  ];

  const infoValores = [
    { label: 'Geração (kWh)', value: pagamento.geracao_kwh.toString() },
    { label: 'TUSD Fio B', value: pagamento.tusd_fio_b.toString() },
    { label: 'Valor TUSD Fio B', value: formatarMoeda(pagamento.valor_tusd_fio_b) },
    { label: 'Valor Concessionária', value: formatarMoeda(pagamento.valor_concessionaria) },
    { label: 'Valor Total', value: formatarMoeda(pagamento.valor_total) },
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <PDFHeader 
          title={`Boletim de Pagamento - ${pagamento.mes}/${pagamento.ano}`} 
          logoUrl="/lovable-uploads/254317ca-d03e-40a5-9286-a175e9dd8bbf.png"
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Gerais</Text>
          <PDFInfoBox items={infoGerais} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datas</Text>
          <PDFInfoBox items={infoDatas} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Valores</Text>
          <PDFInfoBox items={infoValores} />
        </View>

        {pagamento.observacao && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observações</Text>
            <Text>{pagamento.observacao}</Text>
          </View>
        )}

        {pagamento.observacao_pagamento && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observações de Pagamento</Text>
            <Text>{pagamento.observacao_pagamento}</Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text>Gerado por COGESOL em {format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</Text>
        </View>
      </Page>
    </Document>
  );
};
