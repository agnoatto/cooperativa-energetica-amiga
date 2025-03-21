
/**
 * Componente principal para geração do PDF da fatura
 * 
 * Organiza e compõe todas as seções do documento PDF da fatura,
 * usando componentes menores para melhor organização e manutenção.
 * Inclui todas as informações relevantes do cooperado e unidade beneficiária.
 */
import React from 'react';
import { Document, Page, View } from '@react-pdf/renderer';
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

/**
 * Componente principal que organiza o PDF da fatura
 * Utiliza componentes menores para cada seção do documento
 */
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
        {/* Cabeçalho com dados completos da fatura */}
        <PDFHeader 
          mesReferencia={mesReferencia} 
          numeroUC={fatura.unidade_beneficiaria.numero_uc}
          nomeCliente={fatura.unidade_beneficiaria.cooperado.nome}
          documento={fatura.unidade_beneficiaria.cooperado.documento}
        />

        {/* Informações do Cliente */}
        <ClientInfoSection 
          nome={fatura.unidade_beneficiaria.cooperado.nome}
          documento={fatura.unidade_beneficiaria.cooperado.documento}
          endereco={fatura.unidade_beneficiaria.endereco}
          telefone={fatura.unidade_beneficiaria.cooperado.telefone}
          email={fatura.unidade_beneficiaria.cooperado.email}
          numero_uc={fatura.unidade_beneficiaria.numero_uc}
          apelido={fatura.unidade_beneficiaria.apelido}
        />

        {/* Informações Destacadas */}
        <HighlightBox 
          numeroUC={fatura.unidade_beneficiaria.numero_uc}
          dataVencimento={fatura.data_vencimento}
          valorAssinatura={fatura.valor_assinatura}
        />

        {/* Análise Mensal */}
        <View style={styles.contentSection}>
          <View style={styles.sectionHeader}>
            <text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>Análise Mensal</text>
          </View>
          
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
