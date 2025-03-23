
/**
 * Funções de filtragem por texto de busca
 * 
 * Este arquivo contém funções para filtrar lançamentos financeiros
 * com base em texto de busca aplicado a vários campos
 */

import { LancamentoFinanceiro } from "@/types/financeiro";

/**
 * Filtra um lançamento com base no texto de busca
 * 
 * @param lancamento O lançamento financeiro a ser filtrado
 * @param termoBusca O termo de busca a ser aplicado
 * @returns true se o lançamento deve ser mantido, false caso contrário
 */
export function filtrarPorTermoBusca(
  lancamento: LancamentoFinanceiro,
  termoBusca: string
): boolean {
  if (!termoBusca || termoBusca.trim() === '') {
    return true;
  }
  
  const termo = termoBusca.toLowerCase().trim();
  
  // Buscar em vários campos
  const descricao = lancamento.descricao?.toLowerCase() || '';
  const cooperadoNome = lancamento.cooperado?.nome?.toLowerCase() || '';
  const investidorNome = lancamento.investidor?.nome_investidor?.toLowerCase() || '';
  const documento = lancamento.cooperado?.documento || lancamento.investidor?.documento || '';
  const numeroUC = lancamento.fatura?.unidade_beneficiaria?.numero_uc?.toLowerCase() || 
                 lancamento.pagamento_usina?.usina?.unidade_usina?.numero_uc?.toLowerCase() || '';
  
  return descricao.includes(termo) || 
         cooperadoNome.includes(termo) || 
         investidorNome.includes(termo) || 
         documento.includes(termo) ||
         numeroUC.includes(termo);
}
