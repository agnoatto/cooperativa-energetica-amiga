
import React from 'react';
import { Document, Page, View, Text } from '@react-pdf/renderer';
import { styles } from './theme';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PagamentoData } from '../pagamentos/types/pagamento';
import { formatCurrency } from './components/PDFTable';

interface BoletimPDFProps {
  pagamento: PagamentoData;
  historicoData: PagamentoData[];
}

export const BoletimPDF: React.FC<BoletimPDFProps> = ({ pagamento, historicoData }) => {
  const valorKwh = pagamento.usina?.valor_kwh || 0;
  const valorBruto = valorKwh * pagamento.geracao_kwh;
  const valorEfetivo = valorBruto - pagamento.valor_tusd_fio_b - pagamento.valor_concessionaria;
  const mesReferencia = format(new Date(pagamento.ano, pagamento.mes - 1), 'MMMM/yyyy', { locale: ptBR });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Boletim de Medição</Text>
            <Text style={styles.headerSubtitle}>Referência: {mesReferencia}</Text>
          </View>
        </View>

        {/* Informações Gerais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Gerais</Text>
          <View style={styles.infoBox}>
            <View style={styles.valoresRow}>
              <Text style={styles.valorLabel}>Investidor:</Text>
              <Text style={styles.text}>{pagamento.usina?.investidor?.nome_investidor || ''}</Text>
            </View>
            <View style={styles.valoresRow}>
              <Text style={styles.valorLabel}>Unidade Consumidora:</Text>
              <Text style={styles.text}>{pagamento.usina?.unidade_usina?.numero_uc || ''}</Text>
            </View>
            <View style={styles.valoresRow}>
              <Text style={styles.valorLabel}>Data de Emissão:</Text>
              <Text style={styles.text}>
                {format(new Date(pagamento.data_emissao || new Date()), 'dd/MM/yyyy', { locale: ptBR })}
              </Text>
            </View>
          </View>
        </View>

        {/* Valores */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Valores do Período</Text>
          <View style={styles.valoresBox}>
            <View style={styles.valoresRow}>
              <Text style={styles.valorLabel}>Geração (kWh):</Text>
              <Text style={styles.valorValue}>{pagamento.geracao_kwh.toString()}</Text>
            </View>
            <View style={styles.valoresRow}>
              <Text style={styles.valorLabel}>Valor do kWh:</Text>
              <Text style={styles.valorValue}>{formatCurrency(valorKwh)}</Text>
            </View>
            <View style={styles.valoresRow}>
              <Text style={styles.valorLabel}>Valor Bruto:</Text>
              <Text style={styles.valorValue}>{formatCurrency(valorBruto)}</Text>
            </View>
            <View style={styles.valoresRow}>
              <Text style={styles.valorLabel}>TUSD Fio B:</Text>
              <Text style={styles.valorValue}>{formatCurrency(pagamento.valor_tusd_fio_b)}</Text>
            </View>
            <View style={styles.valoresRow}>
              <Text style={styles.valorLabel}>Fatura Concessionária:</Text>
              <Text style={styles.valorValue}>{formatCurrency(pagamento.valor_concessionaria)}</Text>
            </View>
            <View style={[styles.valoresRow, { marginTop: '10px', paddingTop: '10px', borderTopWidth: 1, borderTopColor: '#ccc' }]}>
              <Text style={[styles.valorLabel, { fontWeight: 'bold' }]}>Valor Líquido:</Text>
              <Text style={[styles.valorValue, { fontSize: 16 }]}>{formatCurrency(valorEfetivo)}</Text>
            </View>
            <View style={[styles.valoresRow, { marginTop: '5px' }]}>
              <Text style={[styles.valorLabel, { fontWeight: 'bold' }]}>Data de Vencimento:</Text>
              <Text style={[styles.valorValue, { fontSize: 14 }]}>
                {pagamento.data_vencimento 
                  ? format(new Date(pagamento.data_vencimento), 'dd/MM/yyyy', { locale: ptBR })
                  : '-'}
              </Text>
            </View>
          </View>
        </View>

        {/* Histórico */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Histórico dos Últimos 12 Meses</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableHeaderText, { width: '15%' }]}>Mês/Ano</Text>
              <Text style={[styles.tableHeaderText, { width: '12%' }]}>Geração</Text>
              <Text style={[styles.tableHeaderText, { width: '15%' }]}>Valor Bruto</Text>
              <Text style={[styles.tableHeaderText, { width: '15%' }]}>Fio B</Text>
              <Text style={[styles.tableHeaderText, { width: '15%' }]}>Concessionária</Text>
              <Text style={[styles.tableHeaderText, { width: '15%' }]}>Valor Líquido</Text>
              <Text style={[styles.tableHeaderText, { width: '13%' }]}>Vencimento</Text>
            </View>
            
            {historicoData.map((item, index) => {
              const valorBrutoHistorico = item.geracao_kwh * (item.usina?.valor_kwh || 0);
              const valorLiquido = valorBrutoHistorico - item.valor_tusd_fio_b - item.valor_concessionaria;
              
              return (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: '15%' }]}>
                    {format(new Date(item.ano, item.mes - 1), 'MMM/yyyy', { locale: ptBR })}
                  </Text>
                  <Text style={[styles.tableCell, { width: '12%' }]}>{item.geracao_kwh}</Text>
                  <Text style={[styles.tableCell, { width: '15%' }]}>{formatCurrency(valorBrutoHistorico)}</Text>
                  <Text style={[styles.tableCell, { width: '15%' }]}>{formatCurrency(item.valor_tusd_fio_b)}</Text>
                  <Text style={[styles.tableCell, { width: '15%' }]}>{formatCurrency(item.valor_concessionaria)}</Text>
                  <Text style={[styles.tableCell, { width: '15%' }]}>{formatCurrency(valorLiquido)}</Text>
                  <Text style={[styles.tableCell, { width: '13%' }]}>
                    {item.data_vencimento 
                      ? format(new Date(item.data_vencimento), 'dd/MM/yyyy', { locale: ptBR })
                      : '-'}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Observações */}
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
