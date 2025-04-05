
/**
 * Utilitários para formatação de valores
 * 
 * Funções para formatação de diversos tipos de valores:
 * moeda, data, percentual, etc.
 */

/**
 * Formata um valor numérico para moeda BRL (R$)
 */
export function formatarMoeda(valor?: number): string {
  if (valor === undefined || valor === null) return "R$ 0,00";
  
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(valor);
}

/**
 * Formata um valor numérico para percentual
 */
export function formatarPercentual(valor?: number): string {
  if (valor === undefined || valor === null) return "0%";
  
  return new Intl.NumberFormat('pt-BR', { 
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor / 100);
}

/**
 * Formata um valor numérico para exibir kWh
 */
export function formatarKWh(valor?: number): string {
  if (valor === undefined || valor === null) return "0 kWh";
  
  return new Intl.NumberFormat('pt-BR').format(valor) + " kWh";
}
