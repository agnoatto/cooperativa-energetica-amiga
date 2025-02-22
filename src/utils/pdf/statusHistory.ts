import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles, TABLE_HEADERS, COLUMN_WIDTHS } from '@/components/pdf/constants';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PagamentoData } from '@/components/pagamentos/types/pagamento';

interface StatusHistoryProps {
  historicoData: PagamentoData[];
}

export const StatusHistory: React.FC<StatusHistoryProps> = ({ historicoData }) => {
  const headers = TABLE_HEADERS.historico;
  const columnWidths = COLUMN_WIDTHS.historico;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Histórico de Status</Text>
      <View style={styles.table}>
        {/* Cabeçalho da tabela */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          {headers.map((header, index) => (
            <Text key={index} style={[styles.tableCell, { width: columnWidths[index] }]}>
              {header}
            </Text>
          ))}
        </View>

        {/* Linhas de dados */}
        {historicoData.map((item) => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: columnWidths[0] }]}>
              {format(new Date(item.ano, item.mes - 1), 'MMMM/yyyy', { locale: ptBR })}
            </Text>
            <Text style={[styles.tableCell, { width: columnWidths[1] }]}>{item.status}</Text>
            <Text style={[styles.tableCell, { width: columnWidths[2] }]}>
              {item.data_pagamento ? format(new Date(item.data_pagamento), 'dd/MM/yyyy', { locale: ptBR }) : '-'}
            </Text>
            <Text style={[styles.tableCell, { width: columnWidths[3] }]}>{item.observacao || '-'}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
