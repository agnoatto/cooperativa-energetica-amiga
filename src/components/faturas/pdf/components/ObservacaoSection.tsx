
/**
 * Componente para exibição de observações no PDF da fatura
 * 
 * Exibe as observações relacionadas à fatura, quando existirem.
 * Limita o número de caracteres para garantir que o PDF permanece em uma página
 * e evita sobreposição com outros elementos do documento.
 */
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { COLORS, FONTS } from '@/components/pdf/theme';
import { truncateForPdf } from '@/utils/pdfUtils';

interface ObservacaoSectionProps {
  observacao: string | null;
  // Limite aproximado de caracteres para manter o PDF em uma página
  // baseado em testes com fonte padrão e espaço disponível
  maxChars?: number;
}

export const ObservacaoSection: React.FC<ObservacaoSectionProps> = ({ 
  observacao, 
  maxChars = 500 // Valor estimado para manter em uma página
}) => {
  if (!observacao) return null;
  
  // Usar a utilidade de truncagem para garantir tamanho adequado
  const textoExibido = truncateForPdf(observacao, maxChars);
  
  return (
    <View style={{ 
      marginTop: 8, 
      marginBottom: 25,  // Reduzido para aproximar do rodapé
      padding: 8, 
      borderWidth: 1, 
      borderColor: COLORS.GRAY, 
      borderRadius: 4 
    }}>
      <Text style={{ 
        fontSize: FONTS.SUBTITLE, 
        marginBottom: 3,
        fontWeight: 'bold',
        textAlign: 'left',
        color: COLORS.BLACK
      }}>
        Observações da Fatura
      </Text>
      <Text style={{ fontSize: FONTS.NORMAL }}>{textoExibido}</Text>
    </View>
  );
};
