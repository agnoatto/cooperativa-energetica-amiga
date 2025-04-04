
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

/**
 * Formata um documento (CPF ou CNPJ) para exibição com máscara
 * 
 * @param documento Número do documento a ser formatado
 * @param tipo Tipo de pessoa (PF ou PJ) - opcional, identifica automaticamente se não informado
 * @returns String formatada com a máscara do documento
 */
export function formatarDocumento(documento: string | null | undefined, tipo?: 'PF' | 'PJ'): string {
  if (!documento) return '-';
  
  // Remover caracteres não numéricos
  const numeroLimpo = documento.replace(/\D/g, '');
  
  // Identificar o tipo de documento pelo tamanho se não foi especificado
  const isPJ = tipo ? tipo === 'PJ' : numeroLimpo.length > 11;
  
  if (isPJ) {
    // Formatar como CNPJ: XX.XXX.XXX/XXXX-XX
    if (numeroLimpo.length !== 14) return documento;
    return numeroLimpo.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5'
    );
  } else {
    // Formatar como CPF: XXX.XXX.XXX-XX
    if (numeroLimpo.length !== 11) return documento;
    return numeroLimpo.replace(
      /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
      '$1.$2.$3-$4'
    );
  }
}

/**
 * Formata um número de telefone brasileiro para exibição com máscara
 * 
 * @param telefone Número de telefone a ser formatado
 * @returns String formatada com a máscara do telefone
 */
export function formatarTelefone(telefone: string | null | undefined): string {
  if (!telefone) return '-';
  
  // Remover caracteres não numéricos
  const numeroLimpo = telefone.replace(/\D/g, '');
  
  // Verificar se é celular (9 dígitos) ou fixo (8 dígitos)
  if (numeroLimpo.length === 11) {
    // Celular: (XX) XXXXX-XXXX
    return numeroLimpo.replace(
      /^(\d{2})(\d{5})(\d{4})$/,
      '($1) $2-$3'
    );
  } else if (numeroLimpo.length === 10) {
    // Fixo: (XX) XXXX-XXXX
    return numeroLimpo.replace(
      /^(\d{2})(\d{4})(\d{4})$/,
      '($1) $2-$3'
    );
  }
  
  // Se não for um formato reconhecido, retorna o original
  return telefone;
}

/**
 * Formata um valor de consumo de energia em kWh para exibição
 * 
 * @param valor Valor em kWh a ser formatado
 * @param casasDecimais Número de casas decimais a exibir
 * @returns String formatada com o valor em kWh
 */
export function formatarKwh(valor: number | null | undefined, casasDecimais: number = 0): string {
  if (valor === null || valor === undefined) return '0';
  
  // Verificar se é um número válido
  if (isNaN(valor)) return '0';
  
  // Formatar usando a API Intl para garantir a formatação correta
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: casasDecimais,
    maximumFractionDigits: casasDecimais
  }).format(valor);
}

/**
 * Formata o tamanho de um arquivo para exibição em KB, MB, GB...
 * 
 * @param bytes Tamanho em bytes do arquivo
 * @returns String formatada com o tamanho do arquivo
 */
export function formatFileSize(bytes: number | null | undefined): string {
  if (bytes === null || bytes === undefined || bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
