
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from '../theme';

interface Column {
  header: string;
  accessor: string;
  width?: string;
}

interface PDFTableProps {
  columns: Column[];
  data: any[];
}

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
            <Text>{row[column.accessor]}</Text>
          </View>
        ))}
      </View>
    ))}
  </View>
);
