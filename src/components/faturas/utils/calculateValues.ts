
// Função auxiliar para remover formatação e converter para número
export const parseValue = (value: string): number => {
  // Se o valor for vazio ou undefined, retorna 0
  if (!value) return 0;

  try {
    // Remove o símbolo da moeda, espaços e pontos de milhares
    const cleanValue = value
      .replace('R$', '')
      .replace(/\./g, '')
      .trim();

    // Substitui a vírgula por ponto para conversão em número
    const numeroFinal = cleanValue.replace(',', '.');
    
    // Converte para número garantindo 2 casas decimais
    return parseFloat(parseFloat(numeroFinal).toFixed(2));

  } catch (error) {
    console.error('Erro ao converter valor:', value, error);
    return 0;
  }
};

export const calculateValues = (
  totalFatura: string,
  iluminacaoPublica: string,
  outrosValores: string,
  faturaConcessionaria: string,
  percentualDesconto: number
) => {
  console.log('Valores recebidos para cálculo:', {
    totalFatura,
    iluminacaoPublica,
    outrosValores,
    faturaConcessionaria,
    percentualDesconto
  });

  // Converte todos os valores usando a função parseValue
  const total = parseValue(totalFatura);
  const iluminacao = parseValue(iluminacaoPublica);
  const outros = parseValue(outrosValores);
  const concessionaria = parseValue(faturaConcessionaria);
  
  console.log('Valores após parseValue:', {
    total,
    iluminacao,
    outros,
    concessionaria
  });

  // Converte o percentual para decimal
  const percentual = percentualDesconto / 100;

  // Base de cálculo para o desconto (apenas sobre o valor da energia)
  const baseDesconto = total - iluminacao - outros;
  
  // Calcula o valor do desconto
  const valorDesconto = parseFloat((baseDesconto * percentual).toFixed(2));
  
  // Valor da assinatura = Total - Desconto - Valor da Concessionária
  const valorAssinatura = parseFloat((total - valorDesconto - concessionaria).toFixed(2));

  console.log('Valores calculados:', {
    baseDesconto,
    valorDesconto,
    valorAssinatura
  });

  return {
    valor_desconto: valorDesconto,
    valor_assinatura: valorAssinatura
  };
};
