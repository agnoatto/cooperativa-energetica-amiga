
/**
 * Componente para exibição de informações destacadas no PDF da fatura
 * 
 * Exibe em destaque a unidade consumidora, data de vencimento e valor a pagar
 */
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from '@/components/pdf/theme';
import { formatarMoeda } from '@/utils/formatters';
import { formatDateToPtBR } from '@/utils/dateFormatters';

interface HighlightBoxProps {
  numeroUC: string;
  dataVencimento: string;
  valorAssinatura: number;
}

export const HighlightBox: React.FC<HighlightBoxProps> = ({
  numeroUC,
  dataVencimento,
  valorAssinatura
}) => (
  <View style={styles.highlightBox}>
    <View style={styles.highlightItem}>
      <Text style={styles.highlightLabel}>Unidade Consumidora:</Text>
      <Text style={styles.highlightValue}>{numeroUC}</Text>
    </View>
    <View style={styles.highlightItem}>
      <Text style={styles.highlightLabel}>Data de Vencimento:</Text>
      <Text style={styles.highlightValue}>
        {formatDateToPtBR(dataVencimento)}
      </Text>
    </View>
    <View style={styles.highlightItem}>
      <Text style={styles.highlightLabel}>Valor a Pagar a Cogesol:</Text>
      <Text style={styles.highlightValue}>{formatarMoeda(valorAssinatura)}</Text>
    </View>
  </View>
);
