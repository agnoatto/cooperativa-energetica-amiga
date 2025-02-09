
export const formatarDocumento = (doc: string) => {
  if (!doc) return '-';
  const numero = doc.replace(/\D/g, '');
  if (numero.length === 11) {
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

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
