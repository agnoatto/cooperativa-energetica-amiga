
/**
 * Componente de cabeçalho para o PDF da fatura
 * 
 * Exibe o título do relatório mensal com o mês/ano de referência e 
 * informações adicionais do cliente para melhor identificação da fatura
 */
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from '@/components/pdf/theme';
import { formatarDocumento } from '@/utils/formatters';

interface PDFHeaderProps {
  mesReferencia: string;
  numeroUC?: string;
  nomeCliente?: string;
  documento?: string | null;
}

export const PDFHeader: React.FC<PDFHeaderProps> = ({ 
  mesReferencia, 
  numeroUC, 
  nomeCliente, 
  documento 
}) => (
  <View style={styles.header}>
    <View style={styles.headerContent}>
      <Text style={styles.headerTitle}>
        Relatório Mensal - Ref.: {mesReferencia}
      </Text>
      
      {/* Informações adicionais do cliente quando disponíveis */}
      {(numeroUC || nomeCliente) && (
        <Text style={styles.headerSubtitle}>
          {numeroUC && `UC: ${numeroUC}`}
          {numeroUC && nomeCliente && ' - '}
          {nomeCliente}
          {documento && ` - ${formatarDocumento(documento)}`}
        </Text>
      )}
    </View>
  </View>
);
