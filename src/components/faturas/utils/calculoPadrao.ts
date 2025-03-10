
/**
 * Implementação do cálculo padrão para faturas
 * 
 * Contém a lógica de cálculo padrão que é usada quando não há
 * template específico ou quando ocorre algum erro no cálculo personalizado.
 */

/**
 * Função simplificada para cálculo padrão de valores de fatura
 */
export function calculoPadrao(
  totalFatura: number,
  iluminacaoPublica: number,
  outrosValores: number,
  faturaConcessionaria: number,
  percentualDesconto: number
) {
  console.log("[calculoPadrao] Iniciando cálculo padrão com:", {
    totalFatura,
    iluminacaoPublica,
    outrosValores,
    faturaConcessionaria,
    percentualDesconto
  });
  
  // Base de cálculo remove custos fixos
  const baseCalculo = totalFatura - iluminacaoPublica - outrosValores;
  console.log("[calculoPadrao] Base de cálculo:", baseCalculo);
  
  // Aplicar percentual de desconto (já está em percentagem, ex: 15 para 15%)
  const valorDesconto = baseCalculo * (percentualDesconto / 100);
  console.log("[calculoPadrao] Valor do desconto:", valorDesconto);
  
  // Assinatura é o que resta após desconto e fatura da concessionária
  const valorAssinatura = totalFatura - valorDesconto - faturaConcessionaria;
  console.log("[calculoPadrao] Valor da assinatura:", valorAssinatura);
  
  // Economia é o desconto aplicado
  const economia = valorDesconto;
  
  console.log("[calculoPadrao] Resultado final:", {
    valorDesconto,
    valorAssinatura,
    economia
  });

  return {
    valorDesconto,
    valorAssinatura,
    economia
  };
}
