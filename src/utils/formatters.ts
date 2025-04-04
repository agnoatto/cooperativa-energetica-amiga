
/**
 * Utilitários de formatação
 * 
 * Funções auxiliares para formatação de valores monetários, datas e outros
 * formatos comuns utilizados na aplicação.
 */

/**
 * Formata um valor numérico para moeda brasileira (BRL)
 */
export function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

/**
 * Formata um número de telefone para o formato brasileiro (XX) XXXXX-XXXX
 */
export function formatarTelefone(telefone: string): string {
  // Remove todos os caracteres não numéricos
  const numeros = telefone.replace(/\D/g, '');
  
  if (numeros.length === 11) {
    // Celular: (XX) XXXXX-XXXX
    return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (numeros.length === 10) {
    // Fixo: (XX) XXXX-XXXX
    return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  // Retorna o original se não conseguir formatar
  return telefone;
}

/**
 * Formata um CPF para o formato XXX.XXX.XXX-XX
 */
export function formatarCPF(cpf: string): string {
  // Remove todos os caracteres não numéricos
  const numeros = cpf.replace(/\D/g, '');
  
  if (numeros.length === 11) {
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  
  // Retorna o original se não conseguir formatar
  return cpf;
}

/**
 * Formata um CNPJ para o formato XX.XXX.XXX/XXXX-XX
 */
export function formatarCNPJ(cnpj: string): string {
  // Remove todos os caracteres não numéricos
  const numeros = cnpj.replace(/\D/g, '');
  
  if (numeros.length === 14) {
    return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  // Retorna o original se não conseguir formatar
  return cnpj;
}

/**
 * Formata um documento (CPF ou CNPJ) automaticamente
 */
export function formatarDocumento(documento: string): string {
  // Remove todos os caracteres não numéricos
  const numeros = documento.replace(/\D/g, '');
  
  if (numeros.length === 11) {
    return formatarCPF(numeros);
  } else if (numeros.length === 14) {
    return formatarCNPJ(numeros);
  }
  
  // Retorna o original se não conseguir formatar
  return documento;
}
