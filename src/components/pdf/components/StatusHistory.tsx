
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from '../theme';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PagamentoData } from '@/components/pagamentos/types/pagamento';

interface StatusHistoryProps {
  historicoData: PagamentoData[];
}

export const StatusHistory: React.FC<StatusHistoryProps> = ({ historicoData }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Histórico de Status</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, { width: '25%' }]}>Mês/Ano</Text>
          <Text style={[styles.tableCell, { width: '20%' }]}>Status</Text>
          <Text style={[styles.tableCell, { width: '20%' }]}>Data</Text>
          <Text style={[styles.tableCell, { width: '35%' }]}>Observação</Text>
        </View>

        {historicoData.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: '25%' }]}>
              {format(new Date(item.ano, item.mes - 1), 'MMMM/yyyy', { locale: ptBR })}
            </Text>
            <Text style={[styles.tableCell, { width: '20%' }]}>{item.status}</Text>
            <Text style={[styles.tableCell, { width: '20%' }]}>
              {item.data_pagamento ? format(new Date(item.data_pagamento), 'dd/MM/yyyy', { locale: ptBR }) : '-'}
            </Text>
            <Text style={[styles.tableCell, { width: '35%' }]}>{item.observacao || '-'}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
