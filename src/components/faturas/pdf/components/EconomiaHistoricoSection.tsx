
/**
 * Componente para exibição do histórico e economia na fatura PDF
 * 
 * Exibe informações sobre economia do mês atual e acumulada,
 * além de um histórico de economias anteriores em formato tabular.
 * Espaçamento reduzido para melhor aproveitamento de layout.
 */
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from '@/components/pdf/theme';
import { formatarMoeda } from '@/utils/formatters';
import { HistoricoFatura } from '@/types/fatura';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EconomiaHistoricoSectionProps {
  consumoKwh: number;
  valorDesconto: number;
  economiaAcumulada: number;
  historicoFiltrado: HistoricoFatura[];
}

export const EconomiaHistoricoSection: React.FC<EconomiaHistoricoSectionProps> = ({
  consumoKwh,
  valorDesconto,
  economiaAcumulada,
  historicoFiltrado
}) => {
  return (
    <View style={{ width: '50%', paddingRight: 5 }}>
      {/* Consumo do mês */}
      <View>
        <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 2 }}>
          Consumo do mês
        </Text>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 3 }}>
          {consumoKwh} kWh
        </Text>
      </View>
      
      {/* Economia do mês - com espaçamento reduzido */}
      <View style={{ marginBottom: 2 }}>
        <Text style={{ fontSize: 10, marginBottom: 1 }}>
          Neste mês você economizou:
        </Text>
        <View style={{ 
          backgroundColor: '#f2fce2', 
          padding: 6, 
          borderRadius: 4,
          marginBottom: 3 
        }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
            {formatarMoeda(valorDesconto)}
          </Text>
        </View>
      </View>
      
      {/* Economia acumulada - com espaçamento reduzido */}
      <View style={{ marginBottom: 3 }}>
        <Text style={{ fontSize: 10, marginBottom: 1 }}>
          Até agora já economizou:
        </Text>
        <View style={{ 
          backgroundColor: '#f2fce2', 
          padding: 6, 
          borderRadius: 4,
          marginBottom: 3
        }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
            {formatarMoeda(economiaAcumulada)}
          </Text>
        </View>
      </View>
      
      {/* Tabela de histórico */}
      <View>
        <View style={{ 
          backgroundColor: '#1a1f2c', 
          padding: 5 
        }}>
          <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
            Histórico de Economia
          </Text>
        </View>
        
        <View style={{ flexDirection: 'row', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
          <Text style={{ flex: 1, fontSize: 10, fontWeight: 'bold' }}>Mês</Text>
          <Text style={{ flex: 1, fontSize: 10, fontWeight: 'bold' }}>Consumo</Text>
          <Text style={{ flex: 1, fontSize: 10, fontWeight: 'bold', textAlign: 'right' }}>Economia</Text>
        </View>
        
        {historicoFiltrado.map((hist, index) => {
          const mesAno = format(new Date(hist.ano, hist.mes - 1), 'MMM/yy', { locale: ptBR });
          
          return (
            <View key={index} style={{ 
              flexDirection: 'row', 
              paddingVertical: 3,
              borderBottomWidth: 1,
              borderBottomColor: '#ddd'
            }}>
              <Text style={{ flex: 1, fontSize: 9 }}>{mesAno}</Text>
              <Text style={{ flex: 1, fontSize: 9 }}>{hist.consumo_kwh} kWh</Text>
              <Text style={{ flex: 1, fontSize: 9, textAlign: 'right' }}>
                {formatarMoeda(hist.valor_desconto)}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};
