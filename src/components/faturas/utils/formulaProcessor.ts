
/**
 * Processador de fórmulas para cálculos personalizados
 * 
 * Este módulo permite a avaliação dinâmica de fórmulas matemáticas
 * baseadas em templates personalizados para cálculos de faturas.
 */

/**
 * Avalia uma fórmula substituindo as variáveis pelos valores
 * @param formula Fórmula como string (ex: "total_fatura * 0.15")
 * @param valores Objeto com os valores das variáveis a serem substituídas
 * @returns Resultado numérico da avaliação da fórmula
 */
export function avaliarFormula(formula: string, valores: Record<string, number>): number {
  console.log("[avaliarFormula] Fórmula original:", formula);
  console.log("[avaliarFormula] Valores:", valores);
  
  // Iniciar com a fórmula original
  let formulaProcessada = formula;
  
  // Substituir cada variável pelo seu valor
  for (const [chave, valor] of Object.entries(valores)) {
    // Verificar se a chave existe na fórmula antes de substituir
    if (formulaProcessada.includes(chave)) {
      // Substituir todas as ocorrências da chave pelo valor
      formulaProcessada = formulaProcessada.replace(
        new RegExp(chave, 'g'),
        valor.toString()
      );
    }
  }
  
  console.log("[avaliarFormula] Fórmula processada para avaliação:", formulaProcessada);
  
  try {
    // Avaliar a expressão matemática
    // eslint-disable-next-line no-eval
    const resultado = eval(formulaProcessada);
    
    if (isNaN(resultado)) {
      console.error("Resultado da fórmula é NaN");
      return 0;
    }
    
    console.log("[avaliarFormula] Resultado:", resultado);
    return resultado;
  } catch (error) {
    console.error("Erro ao avaliar fórmula:", error, "Fórmula:", formulaProcessada);
    throw new Error(`Erro ao avaliar fórmula: ${error}`);
  }
}
