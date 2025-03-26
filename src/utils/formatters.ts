
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
export function formatarDocumento(documento: string): string {
  // Remover caracteres não numéricos
  const apenasNumeros = documento.replace(/\D/g, '');
  
  // Formatar CPF: 000.000.000-00
  if (apenasNumeros.length === 11) {
    return apenasNumeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } 
  // Formatar CNPJ: 00.000.000/0000-00
  else if (apenasNumeros.length === 14) {
    return apenasNumeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  // Retornar sem formatação caso não seja CPF nem CNPJ
  return documento;
}
