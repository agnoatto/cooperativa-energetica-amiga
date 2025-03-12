
/**
 * Componente para exibição de observações no PDF da fatura
 * 
 * Exibe as observações relacionadas à fatura, quando existirem
 */
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { COLORS, FONTS } from '@/components/pdf/theme';

interface ObservacaoSectionProps {
  observacao: string | null;
}

export const ObservacaoSection: React.FC<ObservacaoSectionProps> = ({ observacao }) => {
  if (!observacao) return null;
  
  return (
    <View style={{ 
      marginTop: 15, 
      marginBottom: 50, // Aumentado o espaço para evitar sobreposição com o rodapé
      padding: 10, 
      borderWidth: 1, 
      borderColor: COLORS.GRAY, 
      borderRadius: 4 
    }}>
      <Text style={{ 
        fontSize: FONTS.SUBTITLE, 
        marginBottom: 5,
        fontWeight: 'bold',
        textAlign: 'center',
        color: COLORS.BLACK // Mantido preto em vez de vermelho
      }}>
        Observações da Fatura
      </Text>
      <Text style={{ fontSize: FONTS.NORMAL }}>{observacao}</Text>
    </View>
  );
};
