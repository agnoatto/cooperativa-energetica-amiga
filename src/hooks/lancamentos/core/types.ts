
/**
 * Tipos básicos para os serviços de lançamentos financeiros
 * 
 * Este arquivo contém tipos utilizados pelos serviços de consulta
 * e enriquecimento de lançamentos financeiros
 */

import { HistoricoStatus, LancamentoFinanceiro } from "@/types/financeiro";

export interface EnriquecimentoParams {
  lancamento: Partial<LancamentoFinanceiro>;
  item: any;
}

export interface ProcessamentoLancamentoParams {
  item: any;
  tipo: 'receita' | 'despesa';
}

export type ConversorHistoricoStatus = (historico: any) => HistoricoStatus[];
