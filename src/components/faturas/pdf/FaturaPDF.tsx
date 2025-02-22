
import React from 'react';
import { Document, Page, View, Text } from '@react-pdf/renderer';
import { styles } from '@/components/pdf/theme';
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
        {/* Cabeçalho */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Fatura de Energia</Text>
            <Text style={styles.headerSubtitle}>Referência: {mesReferencia}</Text>
          </View>
        </View>

        {/* Informações do Cliente */}
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
              <Text style={styles.valorLabel}>Unidade Consumidora:</Text>
              <Text style={styles.text}>{fatura.unidade_beneficiaria.numero_uc}</Text>
            </View>
            <View style={styles.valoresRow}>
              <Text style={styles.valorLabel}>Endereço:</Text>
              <Text style={styles.text}>{fatura.unidade_beneficiaria.endereco}</Text>
            </View>
          </View>
        </View>

        {/* Informações de Consumo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Consumo</Text>
          <View style={styles.valoresBox}>
            <View style={styles.valoresRow}>
              <Text style={styles.valorLabel}>Consumo (kWh):</Text>
              <Text style={styles.valorValue}>{fatura.consumo_kwh}</Text>
            </View>
            <View style={styles.valoresRow}>
              <Text style={styles.valorLabel}>Saldo de Energia (kWh):</Text>
              <Text style={styles.valorValue}>{fatura.saldo_energia_kwh}</Text>
            </View>
          </View>
        </View>

        {/* Detalhamento de Valores */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalhamento de Valores</Text>
          <View style={styles.valoresBox}>
            <View style={styles.valoresRow}>
              <Text style={styles.valorLabel}>Valor Total:</Text>
              <Text style={styles.valorValue}>{formatarMoeda(fatura.total_fatura)}</Text>
            </View>
            <View style={styles.valoresRow}>
              <Text style={styles.valorLabel}>Iluminação Pública:</Text>
              <Text style={styles.valorValue}>{formatarMoeda(fatura.iluminacao_publica)}</Text>
            </View>
            <View style={styles.valoresRow}>
              <Text style={styles.valorLabel}>Outros Valores:</Text>
              <Text style={styles.valorValue}>{formatarMoeda(fatura.outros_valores)}</Text>
            </View>
            <View style={styles.valoresRow}>
              <Text style={styles.valorLabel}>Desconto:</Text>
              <Text style={[styles.valorValue, { color: '#008000' }]}>
                {formatarMoeda(fatura.valor_desconto)}
              </Text>
            </View>
            <View style={[styles.valoresRow, { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#ccc' }]}>
              <Text style={[styles.valorLabel, { fontWeight: 'bold' }]}>Valor a Pagar:</Text>
              <Text style={[styles.valorValue, { fontSize: 16 }]}>
                {formatarMoeda(fatura.valor_assinatura)}
              </Text>
            </View>
          </View>
        </View>

        {/* Economia */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Economia</Text>
          <View style={styles.valoresBox}>
            <View style={styles.valoresRow}>
              <Text style={styles.valorLabel}>Economia do Mês:</Text>
              <Text style={[styles.valorValue, { color: '#008000' }]}>
                {formatarMoeda(fatura.valor_desconto)}
              </Text>
            </View>
            <View style={styles.valoresRow}>
              <Text style={styles.valorLabel}>Economia Acumulada:</Text>
              <Text style={[styles.valorValue, { color: '#008000' }]}>
                {formatarMoeda(fatura.economia_acumulada)}
              </Text>
            </View>
          </View>
        </View>

        {/* Observações */}
        {fatura.observacao && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observações</Text>
            <Text style={styles.text}>{fatura.observacao}</Text>
          </View>
        )}

        {/* Rodapé */}
        <View style={[styles.section, { marginTop: 'auto' }]}>
          <Text style={[styles.text, { fontSize: 8, textAlign: 'center', color: '#666' }]}>
            Deverá ser pago a sua fatura COGESOL e a fatura RGE!
          </Text>
          <View style={[styles.infoBox, { marginTop: 10 }]}>
            <Text style={[styles.text, { fontSize: 8 }]}>
              COGESOL Cooperativa de Energia Renovável
            </Text>
            <Text style={[styles.text, { fontSize: 8 }]}>
              CNPJ: 00.175.059/0001-00
            </Text>
            <Text style={[styles.text, { fontSize: 8 }]}>
              Rua Julio Golin, 552 - Centro - Nonoai/RS
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
