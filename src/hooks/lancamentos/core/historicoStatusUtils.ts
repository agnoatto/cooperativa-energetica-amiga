
/**
 * Utilitários para processamento do histórico de status de lançamentos
 * 
 * Este arquivo contém funções auxiliares para conversão e tratamento
 * do histórico de status dos lançamentos financeiros
 */

import { HistoricoStatus } from "@/types/financeiro";

/**
 * Converte o histórico de status de um lançamento no formato padrão
 * 
 * @param historico O histórico de status a ser convertido
 * @returns Array de histórico de status formatado
 */
export function converterHistoricoStatus(historico: any): HistoricoStatus[] {
  // Se não houver histórico, retornar array vazio
  if (!historico) {
    return [];
  }
  
  // Se já for um array, mapear para o formato correto
  if (Array.isArray(historico)) {
    return historico.map((hist: any) => ({
      data: hist.data || '',
      status_anterior: hist.status_anterior || 'pendente',
      novo_status: hist.novo_status || 'pendente'
    }));
  } 
  
  // Se for string, tentar converter de JSON
  try {
    const parsedHistorico = typeof historico === 'string' 
      ? JSON.parse(historico) 
      : historico;
    
    if (Array.isArray(parsedHistorico)) {
      return parsedHistorico.map((hist: any) => ({
        data: hist.data || '',
        status_anterior: hist.status_anterior || 'pendente',
        novo_status: hist.novo_status || 'pendente'
      }));
    }
  } catch (e) {
    console.error('Erro ao converter historico_status:', e);
  }
  
  // Retornar array vazio em caso de falha
  return [];
}
