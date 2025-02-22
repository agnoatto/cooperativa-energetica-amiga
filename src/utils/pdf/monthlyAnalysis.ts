import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles, TABLE_HEADERS, COLUMN_WIDTHS } from '@/components/pdf/constants';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PagamentoData } from '@/components/pagamentos/types/pagamento';
import { formatarMoeda } from '@/utils/formatters';

interface MonthlyAnalysisProps {
  pagamento: PagamentoData;
  historicoData: PagamentoData[];
}

export const MonthlyAnalysis: React.FC<MonthlyAnalysisProps> = ({ pagamento, historicoData }) => {
  const getFormattedDate = (date: Date) => {
    return format(date, 'MMMM/yyyy', { locale: ptBR });
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Análise Mensal</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          {TABLE_HEADERS.medicoesAnteriores.map((header, index) => (
            <Text key={index} style={[styles.tableCell, { width: COLUMN_WIDTHS.medicoesAnteriores[index] }]}>
              {header}
            </Text>
          ))}
        </View>
        
        {historicoData.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: COLUMN_WIDTHS.medicoesAnteriores[0] }]}>
              {getFormattedDate(new Date(item.ano, item.mes - 1, 1))}
            </Text>
            <Text style={[styles.tableCell, { width: COLUMN_WIDTHS.medicoesAnteriores[1] }]}>
              {item.geracao_kwh} kWh
            </Text>
            <Text style={[styles.tableCell, { width: COLUMN_WIDTHS.medicoesAnteriores[2] }]}>
              {formatarMoeda(item.valor_kwh)}
            </Text>
            <Text style={[styles.tableCell, { width: COLUMN_WIDTHS.medicoesAnteriores[3] }]}>
              {formatarMoeda(item.valor_total)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};
