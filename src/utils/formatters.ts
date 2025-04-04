
/**
 * Utilitários para formatação de valores
 * 
 * Este arquivo contém funções auxiliares para formatação de valores
 * em formatos específicos para o sistema de gestão de energia.
 */

/**
 * Formata um valor numérico para o formato de moeda brasileira (R$)
 * 
 * @param valor Valor numérico a ser formatado
 * @param moeda Símbolo da moeda (padrão: R$)
 * @returns String formatada com o valor em moeda
 */
export function formatarMoeda(valor: number | string | null | undefined, moeda: string = 'R$'): string {
  if (valor === null || valor === undefined) return `${moeda} 0,00`;
  
  // Converter para número se for string
  const valorNumerico = typeof valor === 'string' ? parseFloat(valor) : valor;
  
  // Verificar se é um número válido
  if (isNaN(valorNumerico)) return `${moeda} 0,00`;
  
  // Formatar usando a API Intl para garantir a formatação correta
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    currencyDisplay: 'symbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valorNumerico);
}

/**
 * Formata um valor percentual para exibição
 * 
 * @param valor Valor percentual a ser formatado
 * @param casasDecimais Número de casas decimais a exibir
 * @returns String formatada com o valor percentual
 */
export function formatarPercentual(valor: number | null | undefined, casasDecimais: number = 2): string {
  if (valor === null || valor === undefined) return '0%';
  
  // Verificar se é um número válido
  if (isNaN(valor)) return '0%';
  
  // Formatar usando a API Intl para garantir a formatação correta
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: casasDecimais,
    maximumFractionDigits: casasDecimais
  }).format(valor / 100);
}

/**
 * Formata um número para exibição com separadores de milhar
 * 
 * @param valor Valor numérico a ser formatado
 * @param casasDecimais Número de casas decimais a exibir
 * @returns String formatada com o número
 */
export function formatarNumero(valor: number | string | null | undefined, casasDecimais: number = 2): string {
  if (valor === null || valor === undefined) return '0';
  
  // Converter para número se for string
  const valorNumerico = typeof valor === 'string' ? parseFloat(valor) : valor;
  
  // Verificar se é um número válido
  if (isNaN(valorNumerico)) return '0';
  
  // Formatar usando a API Intl para garantir a formatação correta
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: casasDecimais,
    maximumFractionDigits: casasDecimais
  }).format(valorNumerico);
}
