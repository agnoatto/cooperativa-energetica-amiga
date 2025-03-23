
/**
 * Processador principal de lançamentos financeiros
 * 
 * Este arquivo contém funções para processar lançamentos financeiros,
 * incluindo construção do objeto base e enriquecimento com dados relacionados
 */

import { LancamentoFinanceiro } from "@/types/financeiro";
import { converterHistoricoStatus } from "../../core/historicoStatusUtils";
import { ProcessamentoLancamentoParams } from "../../core/types";
import { enriquecerDadosCooperado } from "../enrichment/cooperadoEnrichment";
import { enriquecerDadosFatura } from "../enrichment/faturaEnrichment";
import { enriquecerDadosInvestidor } from "../enrichment/investidorEnrichment";
import { enriquecerDadosPagamentoUsina } from "../enrichment/pagamentoUsinaEnrichment";

/**
 * Processa um item de lançamento, construindo o objeto completo
 * com todos os dados relacionados
 * 
 * @param params Parâmetros do processamento
 * @returns Lançamento processado ou null se deve ser ignorado
 */
export async function processarLancamento({ 
  item, 
  tipo 
}: ProcessamentoLancamentoParams): Promise<LancamentoFinanceiro | null> {
  try {
    // Converter o histórico de status
    const historicoStatus = converterHistoricoStatus(item.historico_status);
    
    // Criar o objeto base do lançamento
    let lancamento: Partial<LancamentoFinanceiro> = {
      ...item,
      historico_status: historicoStatus,
      cooperado: null,
      investidor: null,
      fatura: null,
      pagamento_usina: null
    };
    
    // Enriquecer com dados de cooperado se aplicável
    if (tipo === 'receita' && item.cooperado_id) {
      lancamento = await enriquecerDadosCooperado({ lancamento, item });
      
      // Enriquecer com dados da fatura (se houver)
      if (item.fatura_id) {
        lancamento = await enriquecerDadosFatura({ lancamento, item });
        
        // Se retornou null, significa que a fatura não está no status correto para ser exibida
        if (lancamento === null) {
          return null;
        }
      }
    }
    
    // Enriquecer com dados de investidor se aplicável
    if (tipo === 'despesa' && item.investidor_id) {
      lancamento = await enriquecerDadosInvestidor({ lancamento, item });
      
      // Enriquecer com dados do pagamento de usina (se houver)
      if (item.pagamento_usina_id) {
        lancamento = await enriquecerDadosPagamentoUsina({ lancamento, item });
      }
    }
    
    return lancamento as LancamentoFinanceiro;
  } catch (e) {
    console.error('Erro ao processar lançamento:', e);
    return null;
  }
}
