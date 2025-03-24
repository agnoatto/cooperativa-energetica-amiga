
/**
 * Tipos comuns usados em múltiplos módulos de lançamentos financeiros
 * 
 * Este arquivo contém definições de tipos reutilizáveis para processamento
 * de lançamentos, enriquecimento de dados e manipulação de filtros.
 */

import { LancamentoFinanceiro, TipoLancamento } from "@/types/financeiro";

/**
 * Parâmetros para processamento de lançamentos
 */
export interface ProcessamentoLancamentoParams {
  item: any;
  tipo: TipoLancamento;
}

/**
 * Parâmetros para funções de enriquecimento
 */
export interface EnriquecimentoParams {
  lancamento: Partial<LancamentoFinanceiro>;
  item: any;
}
