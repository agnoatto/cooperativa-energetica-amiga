
/**
 * Componente principal para geração do PDF da fatura
 * 
 * Organiza e compõe todas as seções do documento PDF da fatura,
 * usando componentes menores para melhor organização e manutenção.
 */
import React from 'react';
import { Document, Page, View, Text } from '@react-pdf/renderer';
import { styles } from '@/components/pdf/theme';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PdfFaturaData } from '@/types/pdf';

import { PDFHeader } from './components/PDFHeader';
import { ClientInfoSection } from './components/ClientInfoSection';
import { HighlightBox } from './components/HighlightBox';
import { EconomiaHistoricoSection } from './components/EconomiaHistoricoSection';
import { CalculoEconomiaSection } from './components/CalculoEconomiaSection';
import { ObservacaoSection } from './components/ObservacaoSection';
import { FooterSection } from './components/FooterSection';

interface FaturaPDFProps {
  fatura: PdfFaturaData;
}

export const FaturaPDF: React.FC<FaturaPDFProps> = ({ fatura }) => {
  const mesReferencia = format(new Date(fatura.ano, fatura.mes - 1), 'MMMM/yy', { locale: ptBR });
  
  const historicoFiltrado = fatura.historico_faturas
    ?.filter(hist => {
      if (hist.ano < fatura.ano) return true;
      if (hist.ano === fatura.ano && hist.mes <= fatura.mes) return true;
      return false;
    })
    .sort((a, b) => {
      if (a.ano !== b.ano) return b.ano - a.ano;
      return b.mes - a.mes;
    })
    .slice(0, 12) || [];

  const economiaAcumulada = historicoFiltrado.reduce((total, hist) => total + hist.valor_desconto, 0) || 0;
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cabeçalho */}
        <PDFHeader mesReferencia={mesReferencia} />

        {/* Informações do Cliente */}
        <ClientInfoSection 
          nome={fatura.unidade_beneficiaria.cooperado.nome}
          documento={fatura.unidade_beneficiaria.cooperado.documento}
          endereco={fatura.unidade_beneficiaria.endereco}
        />

        {/* Informações Destacadas */}
        <HighlightBox 
          numeroUC={fatura.unidade_beneficiaria.numero_uc}
          dataVencimento={fatura.data_vencimento}
          valorAssinatura={fatura.valor_assinatura}
        />

        {/* Análise Mensal */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionHeader}>Análise Mensal</Text>
          
          <View style={{ flexDirection: 'row' }}>
            {/* Coluna Esquerda - Histórico de Economia */}
            <EconomiaHistoricoSection 
              consumoKwh={fatura.consumo_kwh}
              valorDesconto={fatura.valor_desconto}
              economiaAcumulada={economiaAcumulada}
              historicoFiltrado={historicoFiltrado}
            />

            {/* Coluna Direita - Cálculo da Economia */}
            <CalculoEconomiaSection 
              faturaConcessionaria={fatura.fatura_concessionaria}
              valorAssinatura={fatura.valor_assinatura}
              totalFatura={fatura.total_fatura}
              iluminacaoPublica={fatura.iluminacao_publica}
              outrosValores={fatura.outros_valores}
              consumoKwh={fatura.consumo_kwh}
              valorDesconto={fatura.valor_desconto}
            />
          </View>
        </View>

        {/* Observações da Fatura */}
        <ObservacaoSection observacao={fatura.observacao} />

        {/* Rodapé */}
        <FooterSection valorAssinatura={fatura.valor_assinatura} />
      </Page>
    </Document>
  );
};
