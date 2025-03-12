
/**
 * Componente de cabeçalho para o PDF da fatura
 * 
 * Exibe o título do relatório mensal com o mês/ano de referência
 */
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from '@/components/pdf/theme';

interface PDFHeaderProps {
  mesReferencia: string;
}

export const PDFHeader: React.FC<PDFHeaderProps> = ({ mesReferencia }) => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>
      Relatório Mensal - Ref.: {mesReferencia}
    </Text>
  </View>
);
