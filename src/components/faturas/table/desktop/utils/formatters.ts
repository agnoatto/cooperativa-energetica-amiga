
/**
 * Utilitários de formatação para a tabela de faturas
 * 
 * Funções para formatar diferentes tipos de dados exibidos na tabela
 * como valores monetários e números, de forma consistente.
 */

/**
 * Formata um valor numérico para moeda brasileira (R$)
 */
export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

/**
 * Formata um valor numérico para representação de kWh
 */
export const formatKwh = (value: number): string => {
  return `${value.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })} kWh`;
};
