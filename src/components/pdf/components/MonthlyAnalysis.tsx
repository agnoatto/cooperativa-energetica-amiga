
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from '../theme';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PagamentoData } from '@/components/pagamentos/types/pagamento';
import { formatarMoeda } from '@/utils/formatters';

interface MonthlyAnalysisProps {
  historicoData: PagamentoData[];
}

export const MonthlyAnalysis: React.FC<MonthlyAnalysisProps> = ({ historicoData }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Análise Mensal</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, { width: '25%' }]}>Mês/Ano</Text>
          <Text style={[styles.tableCell, { width: '25%' }]}>Geração (kWh)</Text>
          <Text style={[styles.tableCell, { width: '25%' }]}>Valor Base</Text>
          <Text style={[styles.tableCell, { width: '25%' }]}>Valor Total</Text>
        </View>
        
        {historicoData.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: '25%' }]}>
              {format(new Date(item.ano, item.mes - 1), 'MMM/yyyy', { locale: ptBR })}
            </Text>
            <Text style={[styles.tableCell, { width: '25%' }]}>{item.geracao_kwh}</Text>
            <Text style={[styles.tableCell, { width: '25%' }]}>
              {formatarMoeda(item.usina?.valor_kwh || 0)}
            </Text>
            <Text style={[styles.tableCell, { width: '25%' }]}>
              {formatarMoeda(item.valor_total)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};
