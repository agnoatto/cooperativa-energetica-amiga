
import React from 'react';
import { Document, Page, View, Text } from '@react-pdf/renderer';
import { styles, COLORS, FONTS } from '@/components/pdf/theme';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PdfFaturaData } from '@/types/pdf';
import { formatarDocumento, formatarMoeda } from '@/utils/formatters';

interface FaturaPDFProps {
  fatura: PdfFaturaData;
}

export const FaturaPDF: React.FC<FaturaPDFProps> = ({ fatura }) => {
  const mesReferencia = format(new Date(fatura.ano, fatura.mes - 1), 'MMMM/yyyy', { locale: ptBR });
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Fatura de Energia</Text>
            <Text style={styles.headerSubtitle}>Referência: {mesReferencia}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: '10px' }}>
          {/* Coluna da esquerda */}
          <View style={{ flex: 1 }}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dados do Cliente</Text>
              <View style={styles.infoBox}>
                <View style={styles.valoresRow}>
                  <Text style={styles.valorLabel}>Nome:</Text>
                  <Text style={styles.text}>{fatura.unidade_beneficiaria.cooperado.nome}</Text>
                </View>
                <View style={styles.valoresRow}>
                  <Text style={styles.valorLabel}>CPF/CNPJ:</Text>
                  <Text style={styles.text}>
                    {formatarDocumento(fatura.unidade_beneficiaria.cooperado.documento || '')}
                  </Text>
                </View>
                <View style={styles.valoresRow}>
                  <Text style={styles.valorLabel}>UC:</Text>
                  <Text style={styles.text}>{fatura.unidade_beneficiaria.numero_uc}</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Consumo e Saldo</Text>
              <View style={styles.valoresBox}>
                <View style={styles.valoresRow}>
                  <Text style={styles.valorLabel}>Consumo (kWh):</Text>
                  <Text style={styles.valorValue}>{fatura.consumo_kwh}</Text>
                </View>
                <View style={styles.valoresRow}>
                  <Text style={styles.valorLabel}>Saldo (kWh):</Text>
                  <Text style={styles.valorValue}>{fatura.saldo_energia_kwh}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Coluna da direita */}
          <View style={{ flex: 1 }}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Detalhamento</Text>
              <View style={styles.valoresBox}>
                <View style={styles.valoresRow}>
                  <Text style={styles.valorLabel}>Valor Total:</Text>
                  <Text style={styles.valorValue}>{formatarMoeda(fatura.total_fatura)}</Text>
                </View>
                <View style={styles.valoresRow}>
                  <Text style={styles.valorLabel}>Ilum. Pública:</Text>
                  <Text style={styles.valorValue}>{formatarMoeda(fatura.iluminacao_publica)}</Text>
                </View>
                <View style={styles.valoresRow}>
                  <Text style={styles.valorLabel}>Outros:</Text>
                  <Text style={styles.valorValue}>{formatarMoeda(fatura.outros_valores)}</Text>
                </View>
                <View style={styles.valoresRow}>
                  <Text style={styles.valorLabel}>Desconto:</Text>
                  <Text style={[styles.valorValue, { color: COLORS.GREEN }]}>
                    {formatarMoeda(fatura.valor_desconto)}
                  </Text>
                </View>
                <View style={[styles.valoresRow, { marginTop: 5, paddingTop: 5, borderTopWidth: 1, borderTopColor: '#ccc' }]}>
                  <Text style={[styles.valorLabel, { fontWeight: 'bold' }]}>Valor a Pagar:</Text>
                  <Text style={[styles.valorValue, { fontSize: FONTS.TITLE }]}>
                    {formatarMoeda(fatura.valor_assinatura)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Histórico dos últimos 12 meses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Histórico de Consumo</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableHeaderText, { width: '25%' }]}>Mês/Ano</Text>
              <Text style={[styles.tableHeaderText, { width: '25%' }]}>Consumo (kWh)</Text>
              <Text style={[styles.tableHeaderText, { width: '25%' }]}>Desconto</Text>
              <Text style={[styles.tableHeaderText, { width: '25%' }]}>Economia</Text>
            </View>
            {fatura.historico_faturas.slice(0, 12).map((historico, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: '25%' }]}>
                  {format(new Date(historico.ano, historico.mes - 1), 'MMM/yyyy', { locale: ptBR })}
                </Text>
                <Text style={[styles.tableCell, { width: '25%' }]}>{historico.consumo_kwh}</Text>
                <Text style={[styles.tableCell, { width: '25%' }]}>
                  {formatarMoeda(historico.valor_desconto)}
                </Text>
                <Text style={[styles.tableCell, { width: '25%', color: COLORS.GREEN }]}>
                  {formatarMoeda(historico.valor_desconto)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Rodapé */}
        <View style={[styles.section, { marginTop: 'auto' }]}>
          <View style={[styles.infoBox, { marginTop: 5 }]}>
            <Text style={[styles.text, { fontSize: FONTS.SMALL, textAlign: 'center', color: COLORS.GRAY }]}>
              Deverá ser pago a sua fatura COGESOL e a fatura RGE!
            </Text>
            <Text style={[styles.text, { fontSize: FONTS.SMALL }]}>
              COGESOL Cooperativa de Energia Renovável - CNPJ: 00.175.059/0001-00
            </Text>
            <Text style={[styles.text, { fontSize: FONTS.SMALL }]}>
              Rua Julio Golin, 552 - Centro - Nonoai/RS
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
