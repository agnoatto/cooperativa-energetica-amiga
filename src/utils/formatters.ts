
export const formatarDocumento = (doc: string, tipo_pessoa?: 'PF' | 'PJ') => {
  if (!doc) return '-';
  const numero = doc.replace(/\D/g, '');
  
  // Se o tipo_pessoa for explicitamente fornecido, usamos ele para determinar o formato
  if (tipo_pessoa === 'PF' || (tipo_pessoa === undefined && numero.length === 11)) {
    return numero.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
  }
  
  return numero.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '$1.$2.$3/$4-$5');
};

export const formatarTelefone = (telefone: string) => {
  if (!telefone) return '-';
  const numero = telefone.replace(/\D/g, '');
  if (numero.length === 11) {
    return numero.replace(/(\d{2})(\d{5})(\d{4})/g, '($1) $2-$3');
  }
  return numero.replace(/(\d{2})(\d{4})(\d{4})/g, '($1) $2-$3');
};

export const formatarMoeda = (valor: number) => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

// Alias para manter compatibilidade com o nome usado em alguns componentes
export const formatCurrency = formatarMoeda;

export const formatarKwh = (valor: number) => {
  return valor?.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) ?? '0,00';
};
