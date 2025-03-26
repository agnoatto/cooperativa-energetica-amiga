
/**
 * Funções utilitárias para formatação de dados
 * 
 * Este módulo contém funções para formatar diferentes tipos de dados,
 * como valores monetários, datas, documentos e tamanhos de arquivo.
 */

/**
 * Formata um número em formato monetário brasileiro (R$)
 */
export function formatMoney(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata um valor em formato monetário brasileiro (R$) - Alias para compatibilidade
 */
export function formatarMoeda(value: number): string {
  return formatMoney(value);
}

/**
 * Formata o tamanho de um arquivo em KB, MB ou GB
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Formata um documento (CPF/CNPJ) com a máscara apropriada
 */
export function formatarDocumento(documento: string, tipo_pessoa?: string): string {
  // Remover caracteres não numéricos
  const apenasNumeros = documento.replace(/\D/g, '');
  
  // Formatar CPF: 000.000.000-00
  if (apenasNumeros.length === 11 || tipo_pessoa === 'PF') {
    return apenasNumeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } 
  // Formatar CNPJ: 00.000.000/0000-00
  else if (apenasNumeros.length === 14 || tipo_pessoa === 'PJ') {
    return apenasNumeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  // Retornar sem formatação caso não seja CPF nem CNPJ
  return documento;
}

/**
 * Formata um número de telefone brasileiro com a máscara apropriada
 */
export function formatarTelefone(telefone: string): string {
  // Remover caracteres não numéricos
  const apenasNumeros = telefone.replace(/\D/g, '');
  
  // Telefone com 11 dígitos (com DDD e 9 na frente): (00) 90000-0000
  if (apenasNumeros.length === 11) {
    return apenasNumeros.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2$3-$4');
  }
  // Telefone com 10 dígitos (com DDD): (00) 0000-0000
  else if (apenasNumeros.length === 10) {
    return apenasNumeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  // Telefone com 9 dígitos (sem DDD): 90000-0000
  else if (apenasNumeros.length === 9) {
    return apenasNumeros.replace(/(\d{5})(\d{4})/, '$1-$2');
  }
  // Telefone com 8 dígitos (sem DDD): 0000-0000
  else if (apenasNumeros.length === 8) {
    return apenasNumeros.replace(/(\d{4})(\d{4})/, '$1-$2');
  }
  
  // Retorna sem formatação caso não se encaixe nos padrões acima
  return telefone;
}

/**
 * Formata um valor numérico para representação de kWh ou kWp
 */
export function formatarKwh(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(valor);
}
