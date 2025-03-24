
/**
 * Utilidades para manipulação de histórico de status
 * 
 * Este arquivo contém funções para converter e manipular o histórico
 * de status dos lançamentos financeiros, garantindo a compatibilidade
 * de tipos entre o Supabase e a aplicação.
 */

import { HistoricoStatus } from "@/types/financeiro";

/**
 * Converte o histórico de status do formato JSON para o formato tipado
 * 
 * @param historicoJson Histórico no formato JSON (como retornado pelo Supabase)
 * @returns Array tipado de HistoricoStatus
 */
export function converterHistoricoStatus(historicoJson: any): HistoricoStatus[] {
  // Se for nulo ou undefined, retornar array vazio
  if (!historicoJson) {
    return [];
  }
  
  // Se for string, tentar fazer o parse
  if (typeof historicoJson === 'string') {
    try {
      historicoJson = JSON.parse(historicoJson);
    } catch (e) {
      console.error('Erro ao fazer parse do histórico de status:', e);
      return [];
    }
  }
  
  // Se for array, mapear para o formato esperado
  if (Array.isArray(historicoJson)) {
    return historicoJson.map(item => ({
      data: item.data || new Date().toISOString(),
      status_anterior: item.status_anterior || null,
      novo_status: item.novo_status || 'pendente',
      valor_pago: item.valor_pago,
      valor_juros: item.valor_juros,
      valor_desconto: item.valor_desconto
    }));
  }
  
  // Se não for nenhum dos formatos esperados, retornar array vazio
  console.warn('Formato inesperado de histórico de status:', historicoJson);
  return [];
}
