
/**
 * Utilitários para formatação de valores
 * 
 * Funções para formatação de diversos tipos de valores:
 * moeda, data, percentual, documentos (CPF/CNPJ), telefone, etc.
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

/**
 * Formata um documento CPF ou CNPJ
 * 
 * Se o tipo de pessoa for fornecido, usa-o para determinar o formato,
 * caso contrário, infere pelo tamanho do documento (11 dígitos = CPF, 14 dígitos = CNPJ)
 */
export function formatarDocumento(
  documento?: string | null, 
  tipoPessoa?: "PF" | "PJ"
): string {
  if (!documento) return "-";
  
  // Remove caracteres não numéricos
  const apenasNumeros = documento.replace(/\D/g, '');
  
  // Determina o tipo de documento pelo tamanho ou pelo parâmetro tipoPessoa
  const isCPF = tipoPessoa ? tipoPessoa === "PF" : apenasNumeros.length <= 11;
  
  if (isCPF) {
    // Formata CPF: 000.000.000-00
    return apenasNumeros
      .padStart(11, '0')
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } else {
    // Formata CNPJ: 00.000.000/0000-00
    return apenasNumeros
      .padStart(14, '0')
      .replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
}

/**
 * Formata um número de telefone brasileiro
 * 
 * Formata para (00) 00000-0000 ou (00) 0000-0000 dependendo do tamanho
 */
export function formatarTelefone(telefone?: string | null): string {
  if (!telefone) return "-";
  
  // Remove caracteres não numéricos
  const apenasNumeros = telefone.replace(/\D/g, '');
  
  // Verifica se é um celular (com 9º dígito) ou telefone fixo
  if (apenasNumeros.length === 11) {
    // Celular: (00) 90000-0000
    return apenasNumeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else {
    // Telefone fixo: (00) 0000-0000
    return apenasNumeros.padStart(10, '0').replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
}

/**
 * Formata um tamanho de arquivo em bytes para uma representação legível
 * 
 * Ex: 1024 -> "1 KB", 2097152 -> "2 MB"
 */
export function formatFileSize(bytes?: number): string {
  if (bytes === undefined || bytes === null || bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
