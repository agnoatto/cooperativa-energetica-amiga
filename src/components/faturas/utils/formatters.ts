
/**
 * Utilitários para formatação e conversão de valores monetários
 * 
 * Este módulo contém funções para garantir a consistência na manipulação
 * de valores monetários em todo o sistema de faturas.
 */

/**
 * Garante que um valor seja numérico, convertendo se necessário
 * @param value Valor de entrada (número ou string)
 * @returns Número válido ou 0 se inválido
 */
export const parseValue = (value: number | string): number => {
  // Se já for número, retorna diretamente
  if (typeof value === 'number') return value;
  
  // Se for string vazia ou não definida, retorna 0
  if (!value) return 0;
  
  // Se for string, tenta converter para número
  const parsed = parseFloat(String(value).replace(/\./g, '').replace(',', '.'));
  
  // Retorna o valor convertido ou 0 se for NaN
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Formata um valor numérico para moeda brasileira
 */
export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
