
/**
 * Componente para exibição do cálculo de economia no PDF da fatura
 * 
 * Exibe comparativo entre fatura sem e com a Cogesol, detalhando valores
 * com espaçamento compacto para melhor aproveitamento do espaço
 */
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles, COLORS } from '@/components/pdf/theme';
import { formatarMoeda } from '@/utils/formatters';

interface CalculoEconomiaSectionProps {
  faturaConcessionaria: number;
  valorAssinatura: number;
  totalFatura: number;
  iluminacaoPublica: number;
  outrosValores: number;
  consumoKwh: number;
  valorDesconto: number;
}

export const CalculoEconomiaSection: React.FC<CalculoEconomiaSectionProps> = ({
  faturaConcessionaria,
  valorAssinatura,
  totalFatura,
  iluminacaoPublica,
  outrosValores,
  consumoKwh,
  valorDesconto
}) => (
  <View style={{ flex: 1.5 }}>
    {/* Fatura SEM a Cogesol */}
    <Text style={[styles.sectionHeader, { backgroundColor: COLORS.RED }]}>
      Fatura SEM a Cogesol
    </Text>
    <View style={styles.table}>
      <View style={[styles.tableRow, { padding: '2px 0' }]}>
        <Text style={styles.tableCell}>Consumo</Text>
        <Text style={styles.tableCell}>{consumoKwh} kWh</Text>
        <Text style={styles.tableCellRight}>
          {formatarMoeda(totalFatura - iluminacaoPublica - outrosValores)}
        </Text>
      </View>
      <View style={[styles.tableRow, { padding: '2px 0' }]}>
        <Text style={styles.tableCell}>Iluminação</Text>
        <Text style={styles.tableCell}>1</Text>
        <Text style={styles.tableCellRight}>{formatarMoeda(iluminacaoPublica)}</Text>
      </View>
      <View style={[styles.tableRow, { padding: '2px 0' }]}>
        <Text style={styles.tableCell}>Demais não abatido</Text>
        <Text style={styles.tableCell}>1</Text>
        <Text style={styles.tableCellRight}>{formatarMoeda(outrosValores)}</Text>
      </View>
      <View style={[styles.tableRow, { backgroundColor: COLORS.LIGHT_GRAY, padding: '2px 0' }]}>
        <Text style={[styles.tableCell, { flex: 2, textAlign: 'right', paddingRight: 10 }]}>Total:</Text>
        <Text style={styles.tableCellRight}>{formatarMoeda(totalFatura)}</Text>
      </View>
    </View>

    {/* Fatura COM a Cogesol */}
    <Text style={[styles.sectionHeader, { backgroundColor: COLORS.BLUE }]}>
      Fatura COM a Cogesol
    </Text>
    <View style={styles.table}>
      <View style={[styles.tableRow, { padding: '2px 0' }]}>
        <Text style={styles.tableCell}>Fatura RGE</Text>
        <Text style={styles.tableCellRight}>{formatarMoeda(faturaConcessionaria)}</Text>
      </View>
      <View style={[styles.tableRow, { padding: '2px 0' }]}>
        <Text style={styles.tableCell}>Fatura Cogesol</Text>
        <Text style={styles.tableCellRight}>{formatarMoeda(valorAssinatura)}</Text>
      </View>
      <View style={[styles.tableRow, { backgroundColor: COLORS.LIGHT_GRAY, padding: '2px 0' }]}>
        <Text style={[styles.tableCell, { textAlign: 'right', paddingRight: 10 }]}>Total:</Text>
        <Text style={styles.tableCellRight}>
          {formatarMoeda(faturaConcessionaria + valorAssinatura)}
        </Text>
      </View>
    </View>

    {/* Cálculo da Economia */}
    <Text style={styles.sectionHeader}>Cálculo da Economia</Text>
    <View style={styles.table}>
      <View style={[styles.tableRow, { padding: '2px 0' }]}>
        <Text style={styles.tableCell}>Valor da Energia SEM a Cogesol</Text>
        <Text style={styles.tableCellRight}>{formatarMoeda(totalFatura)}</Text>
      </View>
      <View style={[styles.tableRow, { padding: '2px 0' }]}>
        <Text style={styles.tableCell}>Valor da Energia COM a Cogesol</Text>
        <Text style={styles.tableCellRight}>
          {formatarMoeda(faturaConcessionaria + valorAssinatura)}
        </Text>
      </View>
    </View>
    <View style={styles.totalRow}>
      <Text style={{ flex: 1 }}>Total ECONOMIA sobre o consumo</Text>
      <Text style={{ fontWeight: 'bold' }}>{formatarMoeda(valorDesconto)}</Text>
    </View>
  </View>
);
