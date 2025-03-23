
/**
 * Funções de filtragem de lançamentos
 * 
 * Este arquivo contém funções para aplicar diversos tipos de filtros
 * aos lançamentos financeiros (status, data, etc.)
 */

import { LancamentoFinanceiro, StatusLancamento } from "@/types/financeiro";
import { filtrarPorTermoBusca } from "./filtrosBusca";

/**
 * Aplica todos os filtros a um lançamento financeiro
 * 
 * @param lancamento O lançamento a ser filtrado
 * @param status Status para filtrar (opcional)
 * @param busca Termo de busca a ser aplicado (opcional)
 * @returns true se o lançamento deve ser mantido, false caso contrário
 */
export function aplicarFiltros(
  lancamento: LancamentoFinanceiro,
  status?: StatusLancamento | 'todos',
  busca?: string
): boolean {
  // Se o lançamento for null, excluir
  if (!lancamento) return false;
  
  // Filtrar por status se especificado e não for 'todos'
  if (status && status !== 'todos' && lancamento.status !== status) {
    return false;
  }
  
  // Filtrar por termo de busca
  if (busca && busca.trim() !== '') {
    return filtrarPorTermoBusca(lancamento, busca);
  }
  
  return true;
}
