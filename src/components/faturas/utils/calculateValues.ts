
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

  const baseDesconto = total - iluminacao - outros;
  const valorDesconto = baseDesconto * percentual;
  const valorAposDesconto = baseDesconto - valorDesconto;
  const valorFinal = valorAposDesconto - concessionaria;

  return {
    valor_desconto: valorDesconto,
    valor_total: valorFinal
  };
};
