
import React from 'react';
import { Document, Page, View, Text, Image } from '@react-pdf/renderer';
import { styles, COLORS, FONTS } from '@/components/pdf/theme';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PdfFaturaData } from '@/types/pdf';
import { formatarDocumento, formatarMoeda } from '@/utils/formatters';

interface FaturaPDFProps {
  fatura: PdfFaturaData;
}

export const FaturaPDF: React.FC<FaturaPDFProps> = ({ fatura }) => {
  const mesReferencia = format(new Date(fatura.ano, fatura.mes - 1), 'MMMM/yy', { locale: ptBR });
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Relatório Mensal - Ref.: {mesReferencia}
          </Text>
        </View>

        {/* Informações do Cliente */}
        <View style={styles.clientInfo}>
          <View style={styles.clientRow}>
            <Text style={styles.clientLabel}>Cliente:</Text>
            <Text>{fatura.unidade_beneficiaria.cooperado.nome}</Text>
          </View>
          <View style={styles.clientRow}>
            <Text style={styles.clientLabel}>CPF/CNPJ:</Text>
            <Text>{formatarDocumento(fatura.unidade_beneficiaria.cooperado.documento || '')}</Text>
          </View>
          <View style={styles.clientRow}>
            <Text style={styles.clientLabel}>Endereço:</Text>
            <Text>{fatura.unidade_beneficiaria.endereco}</Text>
          </View>
        </View>

        {/* Informações Destacadas */}
        <View style={styles.highlightBox}>
          <View style={styles.highlightItem}>
            <Text style={styles.highlightLabel}>Unidade Consumidora:</Text>
            <Text style={styles.highlightValue}>{fatura.unidade_beneficiaria.numero_uc}</Text>
          </View>
          <View style={styles.highlightItem}>
            <Text style={styles.highlightLabel}>Data de Vencimento:</Text>
            <Text style={styles.highlightValue}>
              {format(new Date(fatura.data_vencimento), 'dd/MM/yyyy')}
            </Text>
          </View>
          <View style={styles.highlightItem}>
            <Text style={styles.highlightLabel}>Valor a Pagar a Cogesol:</Text>
            <Text style={styles.highlightValue}>{formatarMoeda(fatura.valor_assinatura)}</Text>
          </View>
        </View>

        {/* Análise Mensal */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionHeader}>Análise Mensal</Text>
          
          <View style={{ flexDirection: 'row' }}>
            {/* Coluna Esquerda */}
            <View style={{ flex: 1, marginRight: 20, borderRight: 1, borderColor: COLORS.GRAY, paddingRight: 20 }}>
              <Text style={{ marginBottom: 10 }}>Consumo do mês</Text>
              <Text style={{ fontSize: FONTS.TITLE, marginBottom: 20 }}>{fatura.consumo_kwh} kWh</Text>
              
              <Text style={{ marginBottom: 5 }}>Neste mês você economizou:</Text>
              <View style={styles.highlightBox}>
                <Text style={styles.highlightValue}>{formatarMoeda(fatura.valor_desconto)}</Text>
              </View>
              
              <Text style={{ marginBottom: 5, marginTop: 10 }}>Até agora já economizou:</Text>
              <View style={styles.highlightBox}>
                <Text style={styles.highlightValue}>{formatarMoeda(fatura.economia_acumulada)}</Text>
              </View>

              {/* Histórico de Economia */}
              <View style={{ marginTop: 20 }}>
                <Text style={{ fontSize: FONTS.SUBTITLE, marginBottom: 10, fontWeight: 'bold' }}>
                  Histórico de Economia
                </Text>
                <View style={styles.table}>
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Mês</Text>
                    <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Consumo</Text>
                    <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Economia</Text>
                  </View>
                  {fatura.historico_faturas?.map((hist) => (
                    <View key={`${hist.mes}-${hist.ano}`} style={styles.tableRow}>
                      <Text style={styles.tableCell}>
                        {format(new Date(hist.ano, hist.mes - 1), 'MMM/yy', { locale: ptBR })}
                      </Text>
                      <Text style={styles.tableCell}>{hist.consumo_kwh} kWh</Text>
                      <Text style={styles.tableCellRight}>{formatarMoeda(hist.valor_desconto)}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Coluna Direita */}
            <View style={{ flex: 1.5 }}>
              {/* Fatura SEM a Cogesol */}
              <Text style={[styles.sectionHeader, { backgroundColor: COLORS.RED }]}>
                Fatura SEM a Cogesol
              </Text>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>Consumo</Text>
                  <Text style={styles.tableCell}>{fatura.consumo_kwh} kWh</Text>
                  <Text style={styles.tableCellRight}>
                    {formatarMoeda(fatura.total_fatura - fatura.iluminacao_publica - fatura.outros_valores)}
                  </Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>Iluminação</Text>
                  <Text style={styles.tableCell}>1</Text>
                  <Text style={styles.tableCellRight}>{formatarMoeda(fatura.iluminacao_publica)}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>Demais não abatido</Text>
                  <Text style={styles.tableCell}>1</Text>
                  <Text style={styles.tableCellRight}>{formatarMoeda(fatura.outros_valores)}</Text>
                </View>
                <View style={[styles.tableRow, { backgroundColor: COLORS.LIGHT_GRAY }]}>
                  <Text style={[styles.tableCell, { flex: 2, textAlign: 'right', paddingRight: 10 }]}>Total:</Text>
                  <Text style={styles.tableCellRight}>{formatarMoeda(fatura.total_fatura)}</Text>
                </View>
              </View>

              {/* Fatura COM a Cogesol */}
              <Text style={[styles.sectionHeader, { backgroundColor: COLORS.BLUE }]}>
                Fatura COM a Cogesol
              </Text>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>Fatura RGE</Text>
                  <Text style={styles.tableCellRight}>{formatarMoeda(fatura.fatura_concessionaria)}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>Fatura Cogesol</Text>
                  <Text style={styles.tableCellRight}>{formatarMoeda(fatura.valor_assinatura)}</Text>
                </View>
                <View style={[styles.tableRow, { backgroundColor: COLORS.LIGHT_GRAY }]}>
                  <Text style={[styles.tableCell, { textAlign: 'right', paddingRight: 10 }]}>Total:</Text>
                  <Text style={styles.tableCellRight}>
                    {formatarMoeda(fatura.fatura_concessionaria + fatura.valor_assinatura)}
                  </Text>
                </View>
              </View>

              {/* Cálculo da Economia */}
              <Text style={styles.sectionHeader}>Cálculo da Economia</Text>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>Valor da Energia SEM a Cogesol</Text>
                  <Text style={styles.tableCellRight}>{formatarMoeda(fatura.total_fatura)}</Text>
                </View>
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>Valor da Energia COM a Cogesol</Text>
                  <Text style={styles.tableCellRight}>
                    {formatarMoeda(fatura.fatura_concessionaria + fatura.valor_assinatura)}
                  </Text>
                </View>
              </View>
              <View style={styles.totalRow}>
                <Text style={{ flex: 1 }}>Total ECONOMIA sobre o consumo</Text>
                <Text style={{ fontWeight: 'bold' }}>{formatarMoeda(fatura.valor_desconto)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Rodapé */}
        <View style={styles.footer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <View>
              <Text>COGESOL Cooperativa de Energia Renovável</Text>
              <Text>CNPJ: 00.175.059/0001-00</Text>
              <Text>Rua Julio Golin, 552 - Centro - Nonoai/RS</Text>
            </View>
            <View style={[styles.highlightBox, { width: 250 }]}>
              <View>
                <Text style={{ fontSize: FONTS.SMALL, marginBottom: 5 }}>Total a pagar pela Assinatura</Text>
                <Text style={styles.highlightValue}>{formatarMoeda(fatura.valor_assinatura)}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.warningText}>
            Deverá ser pago a sua fatura COGESOL e a fatura RGE!
          </Text>
        </View>
      </Page>
    </Document>
  );
};
