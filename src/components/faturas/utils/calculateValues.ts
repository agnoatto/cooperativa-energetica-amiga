
export const parseValue = (value: string): number => {
  return Number(value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
};

export const calculateValues = (
  totalFatura: string,
  iluminacaoPublica: string,
  outrosValores: string,
  faturaConcessionaria: string,
  percentualDesconto: number
) => {
  const total = parseValue(totalFatura);
  const iluminacao = parseValue(iluminacaoPublica);
  const outros = parseValue(outrosValores);
  const concessionaria = parseValue(faturaConcessionaria);
  const percentual = percentualDesconto / 100;

  // Base de cálculo para o desconto
  const baseDesconto = total - iluminacao - outros;
  // Valor do desconto
  const valorDesconto = baseDesconto * percentual;
  // Valor da assinatura = Total - Desconto - Concessionária
  const valorFinal = total - valorDesconto - concessionaria;

  return {
    valor_desconto: valorDesconto,
    valor_total: valorFinal
  };
};
