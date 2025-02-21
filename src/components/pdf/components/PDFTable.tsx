
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from '../theme';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Column {
  header: string;
  accessor: string;
  width?: string;
  format?: (value: any) => string;
}

interface PDFTableProps {
  columns: Column[];
  data: any[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const formatDate = (date: string) => {
  if (!date) return '';
  return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
};

export const PDFTable: React.FC<PDFTableProps> = ({ columns, data }) => (
  <View style={styles.table}>
    <View style={[styles.tableRow, styles.tableHeader]}>
      {columns.map((column, index) => (
        <View 
          key={index} 
          style={[
            styles.tableCell, 
            { width: column.width || `${100 / columns.length}%` }
          ]}
        >
          <Text>{column.header}</Text>
        </View>
      ))}
    </View>
    {data.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.tableRow}>
        {columns.map((column, colIndex) => (
          <View 
            key={colIndex} 
            style={[
              styles.tableCell, 
              { width: column.width || `${100 / columns.length}%` }
            ]}
          >
            <Text>
              {column.format 
                ? column.format(row[column.accessor])
                : row[column.accessor]?.toString() || ''}
            </Text>
          </View>
        ))}
      </View>
    ))}
  </View>
);
