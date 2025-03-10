
/**
 * Processador de templates de cálculo
 * 
 * Este módulo implementa a lógica de aplicação de templates
 * para cálculos personalizados de valores de faturas.
 */

import { toast } from "sonner";
import { CalculoFaturaTemplate } from "@/types/template";
import { avaliarFormula } from "./formulaProcessor";
import { calculoPadrao } from "./calculoPadrao";

/**
 * Aplica as fórmulas do template para calcular os valores
 */
export function aplicarFormulasTemplate(
  template: CalculoFaturaTemplate,
  totalFatura: number,
  iluminacaoPublica: number,
  outrosValores: number,
  faturaConcessionaria: number,
  percentualDesconto: number
) {
  console.log("[aplicarFormulasTemplate] Iniciando com valores:", {
    totalFatura,
    iluminacaoPublica,
    outrosValores,
    faturaConcessionaria,
    percentualDesconto
  });
  
  // Calcular desconto usando a fórmula do template
  let valorDesconto = 0;
  try {
    // Criar objeto com os valores para substituição na fórmula
    const valores = {
      total_fatura: totalFatura,
      iluminacao_publica: iluminacaoPublica,
      outros_valores: outrosValores,
      fatura_concessionaria: faturaConcessionaria,
      percentual_desconto: percentualDesconto
    };
    
    // Aplicar a fórmula de desconto
    valorDesconto = avaliarFormula(template.formula_valor_desconto, valores);
    console.log("[aplicarFormulasTemplate] Valor de desconto calculado:", valorDesconto);
  } catch (error) {
    console.error("Erro ao calcular valor de desconto:", error);
    toast.error("Erro no cálculo do desconto. Usando método padrão.");
    
    // Cálculo padrão para o desconto
    const baseCalculo = totalFatura - iluminacaoPublica - outrosValores;
    valorDesconto = baseCalculo * (percentualDesconto / 100);
    console.log("[aplicarFormulasTemplate] Valor de desconto pelo cálculo padrão:", valorDesconto);
  }

  // Calcular assinatura usando a fórmula do template
  let valorAssinatura = 0;
  try {
    // Incluir o valor do desconto para o cálculo da assinatura
    const valores = {
      total_fatura: totalFatura,
      iluminacao_publica: iluminacaoPublica,
      outros_valores: outrosValores,
      fatura_concessionaria: faturaConcessionaria,
      percentual_desconto: percentualDesconto,
      valor_desconto: valorDesconto
    };
    
    // Aplicar a fórmula de assinatura
    valorAssinatura = avaliarFormula(template.formula_valor_assinatura, valores);
    console.log("[aplicarFormulasTemplate] Valor de assinatura calculado:", valorAssinatura);
  } catch (error) {
    console.error("Erro ao calcular valor de assinatura:", error);
    toast.error("Erro no cálculo da assinatura. Usando método padrão.");
    
    // Cálculo padrão para a assinatura
    valorAssinatura = totalFatura - valorDesconto - faturaConcessionaria;
    console.log("[aplicarFormulasTemplate] Valor de assinatura pelo cálculo padrão:", valorAssinatura);
  }

  // Calcular economia (igual ao desconto)
  const economia = valorDesconto;
  
  console.log("[aplicarFormulasTemplate] Resultado final:", {
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
