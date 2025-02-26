
// Função auxiliar para remover formatação e converter para número
export const parseValue = (value: string): number => {
  // Se o valor for vazio ou undefined, retorna 0
  if (!value) return 0;

  // Remove o símbolo da moeda e espaços
  let cleanValue = value.replace('R$', '').trim();
  
  // Remove os pontos de milhares (1.000 -> 1000)
  cleanValue = cleanValue.replace(/\./g, '');
  
  // Substitui a vírgula decimal por ponto
  cleanValue = cleanValue.replace(',', '.');
  
  // Converte para número e garante 2 casas decimais
  const numberValue = parseFloat(cleanValue);
  
  // Se não for um número válido, retorna 0
  if (isNaN(numberValue)) return 0;
  
  // Retorna o valor com 2 casas decimais
  return Number(numberValue.toFixed(2));
};

export const calculateValues = (
  totalFatura: string,
  iluminacaoPublica: string,
  outrosValores: string,
  faturaConcessionaria: string,
  percentualDesconto: number
) => {
  // Converte todos os valores usando a função parseValue corrigida
  const total = parseValue(totalFatura);
  const iluminacao = parseValue(iluminacaoPublica);
  const outros = parseValue(outrosValores);
  const concessionaria = parseValue(faturaConcessionaria);
  
  // Converte o percentual para decimal (ex: 20% -> 0.20)
  const percentual = percentualDesconto / 100;

  // Base de cálculo para o desconto (apenas sobre o valor da energia)
  const baseDesconto = total - iluminacao - outros;
  
  // Calcula o valor do desconto com 2 casas decimais
  const valorDesconto = Number((baseDesconto * percentual).toFixed(2));
  
  // Valor da assinatura = Total - Desconto - Valor da Concessionária
  const valorAssinatura = Number((total - valorDesconto - concessionaria).toFixed(2));

  return {
    valor_desconto: valorDesconto,
    valor_assinatura: valorAssinatura
  };
};
