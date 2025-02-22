
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from '../theme';
import { formatarMoeda } from '@/utils/formatters';
import { PagamentoData } from '@/components/pagamentos/types/pagamento';

interface BoletimSectionsProps {
  pagamento: PagamentoData;
}

export const GeracaoDetailsSection: React.FC<BoletimSectionsProps> = ({ pagamento }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Detalhes da Geração</Text>
    <View style={styles.row}>
      <Text style={styles.valorLabel}>Geração (kWh):</Text>
      <Text style={styles.text}>{pagamento.geracao_kwh} kWh</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.valorLabel}>Valor por kWh:</Text>
      <Text style={styles.text}>{formatarMoeda(pagamento.usina?.valor_kwh || 0)}</Text>
    </View>
  </View>
);

export const ValoresCalculadosSection: React.FC<BoletimSectionsProps> = ({ pagamento }) => {
  const valorBase = (pagamento.geracao_kwh || 0) * (pagamento.usina?.valor_kwh || 0);
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Valores Calculados</Text>
      <View style={styles.row}>
        <Text style={styles.valorLabel}>Valor Bruto:</Text>
        <Text style={styles.text}>{formatarMoeda(valorBase)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.valorLabel}>TUSD Fio B:</Text>
        <Text style={styles.text}>{formatarMoeda(pagamento.valor_tusd_fio_b)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.valorLabel}>Valor Total:</Text>
        <Text style={styles.text}>{formatarMoeda(pagamento.valor_total)}</Text>
      </View>
    </View>
  );
};

export const ObservacoesSection: React.FC<BoletimSectionsProps> = ({ pagamento }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Observações</Text>
    <Text style={styles.text}>{pagamento.observacoes || 'Nenhuma observação.'}</Text>
  </View>
);
