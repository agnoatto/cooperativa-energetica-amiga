
/**
 * Componente para exibição do histórico de economia no PDF da fatura
 * 
 * Exibe o consumo mensal e o histórico de economias dos últimos meses
 */
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles, COLORS, FONTS } from '@/components/pdf/theme';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatarMoeda } from '@/utils/formatters';
import { HistoricoFatura } from '@/types/fatura';

interface EconomiaHistoricoSectionProps {
  consumoKwh: number;
  valorDesconto: number;
  economiaAcumulada: number;
  historicoFiltrado: HistoricoFatura[];
}

export const EconomiaHistoricoSection: React.FC<EconomiaHistoricoSectionProps> = ({
  consumoKwh,
  valorDesconto,
  economiaAcumulada,
  historicoFiltrado
}) => (
  <View style={{ flex: 1, marginRight: 20, borderRight: 1, borderColor: COLORS.GRAY, paddingRight: 20 }}>
    <Text style={{ marginBottom: 10, fontSize: FONTS.SUBTITLE }}>Consumo do mês</Text>
    <Text style={{ 
      fontSize: FONTS.HEADER,
      marginBottom: 20,
      color: COLORS.PRIMARY,
      fontWeight: 'bold'
    }}>{consumoKwh} kWh</Text>
    
    <Text style={{ marginBottom: 5 }}>Neste mês você economizou:</Text>
    <View style={styles.highlightBox}>
      <Text style={styles.highlightValue}>{formatarMoeda(valorDesconto)}</Text>
    </View>
    
    <Text style={{ marginBottom: 5, marginTop: 10 }}>Até agora já economizou:</Text>
    <View style={styles.highlightBox}>
      <Text style={styles.highlightValue}>{formatarMoeda(economiaAcumulada)}</Text>
    </View>

    {/* Histórico de Economia - Ajustado para o mesmo tamanho do "Cálculo da Economia" */}
    <View style={{ marginTop: 20 }}>
      <Text style={[styles.sectionHeader, { 
        fontSize: FONTS.SUBTITLE, 
        marginBottom: 15
      }]}>
        Histórico de Economia
      </Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Mês</Text>
          <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Consumo</Text>
          <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>Economia</Text>
        </View>
        {historicoFiltrado.map((hist) => (
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
);
