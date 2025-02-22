import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles, TABLE_HEADERS, COLUMN_WIDTHS } from '@/components/pdf/constants';
import { formatarMoeda } from '@/utils/formatters';
import { PagamentoData } from '@/components/pagamentos/types/pagamento';

interface BoletimSectionsProps {
  pagamento: PagamentoData;
}

export const GeracaoDetailsSection: React.FC<BoletimSectionsProps> = ({ pagamento }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Detalhes da Geração</Text>
    <View style={styles.row}>
      <Text style={styles.label}>Geração (kWh):</Text>
      <Text style={styles.value}>{pagamento.geracao_kwh} kWh</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Valor por kWh:</Text>
      <Text style={styles.value}>{formatarMoeda(pagamento.usina?.valor_kwh || 0)}</Text>
    </View>
  </View>
);

export const ValoresCalculadosSection: React.FC<BoletimSectionsProps> = ({ pagamento }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Valores Calculados</Text>
    <View style={styles.row}>
      <Text style={styles.label}>Valor Bruto:</Text>
      <Text style={styles.value}>{formatarMoeda(pagamento.valor_bruto)}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Valor Total TUSD Fio B:</Text>
      <Text style={styles.value}>{formatarMoeda(pagamento.valor_total_tusd_fio_b)}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Valor Efetivo:</Text>
      <Text style={styles.value}>{formatarMoeda(pagamento.valor_total)}</Text>
    </View>
  </View>
);

interface ObservacoesSectionProps {
  pagamento: PagamentoData;
}

export const ObservacoesSection: React.FC<ObservacoesSectionProps> = ({ pagamento }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Observações</Text>
    <Text>{pagamento.observacoes || 'Nenhuma observação.'}</Text>
  </View>
);
