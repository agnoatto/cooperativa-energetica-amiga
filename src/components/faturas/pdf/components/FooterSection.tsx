
/**
 * Componente de rodapé para o PDF da fatura
 * 
 * Exibe informações da cooperativa, valor a pagar e texto de aviso
 */
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles, FONTS } from '@/components/pdf/theme';
import { formatarMoeda } from '@/utils/formatters';

interface FooterSectionProps {
  valorAssinatura: number;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ valorAssinatura }) => (
  <View style={[styles.footer, { bottom: 0, left: 0, right: 0, padding: '10px 20px' }]}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
      <View>
        <Text>COGESOL Cooperativa de Energia Renovável</Text>
        <Text>CNPJ: 00.175.059/0001-00</Text>
        <Text>Rua Julio Golin, 552 - Centro - Nonoai/RS</Text>
      </View>
      <View style={[styles.highlightBox, { width: 250, marginTop: 0, marginBottom: 0 }]}>
        <View>
          <Text style={{ fontSize: FONTS.SMALL, marginBottom: 5 }}>Total a pagar pela Assinatura</Text>
          <Text style={styles.highlightValue}>{formatarMoeda(valorAssinatura)}</Text>
        </View>
      </View>
    </View>
    <View style={[styles.warningBox, { marginTop: 0 }]}>
      <Text style={styles.warningText}>
        Deverá ser pago a sua fatura COGESOL e a fatura RGE!
      </Text>
    </View>
  </View>
);
