
// Função auxiliar para remover formatação e converter para número
export const parseValue = (value: string): number => {
  // Se o valor for vazio ou undefined, retorna 0
  if (!value) return 0;

  try {
    // Se o valor já for um número, simplesmente converte para número
    // Isso evita processamento desnecessário
    if (!isNaN(Number(value)) && !value.includes(',') && !value.includes('.')) {
      return Number(value);
    }

    // Remove espaços e substitui pontos (de milhares) por nada
    const cleanValue = value.replace(/\./g, '').trim();
    
    // Substitui a vírgula por ponto para conversão em número
    const numeroFinal = cleanValue.replace(',', '.');
    
    // Converte para número garantindo 2 casas decimais
    const resultado = parseFloat(parseFloat(numeroFinal).toFixed(2));
    
    // Se o resultado for NaN, retorna 0
    return isNaN(resultado) ? 0 : resultado;

  } catch (error) {
    console.error('[parseValue] Erro ao converter valor:', value, error);
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
  console.log('[calculateValues] Valores recebidos para cálculo:', {
    totalFatura,
    iluminacaoPublica,
    outrosValores,
    faturaConcessionaria,
    percentualDesconto,
    tipos: {
      totalFatura: typeof totalFatura,
      iluminacaoPublica: typeof iluminacaoPublica,
      outrosValores: typeof outrosValores,
      faturaConcessionaria: typeof faturaConcessionaria
    }
  });

  // Converte todos os valores usando a função parseValue
  const total = parseValue(totalFatura);
  const iluminacao = parseValue(iluminacaoPublica);
  const outros = parseValue(outrosValores);
  const concessionaria = parseValue(faturaConcessionaria);
  
  console.log('[calculateValues] Valores após parseValue:', {
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

  console.log('[calculateValues] Valores calculados:', {
    baseDesconto,
    valorDesconto,
    valorAssinatura
  });

  return {
    valor_desconto: valorDesconto,
    valor_assinatura: valorAssinatura
  };
};
