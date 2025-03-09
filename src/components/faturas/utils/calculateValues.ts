
/**
 * Utilitários para cálculo de valores das faturas
 * 
 * Este módulo contém funções simplificadas para calcular valores derivados
 * das faturas, utilizando dados numéricos diretamente sem conversões desnecessárias.
 * Os valores já vêm como números do CurrencyInput e são usados diretamente.
 */

import { supabase } from "@/integrations/supabase/client";
import { CalculoFaturaTemplate } from "@/types/template";
import { toast } from "sonner";

/**
 * Garante que um valor seja numérico, convertendo se necessário
 * @param value Valor de entrada (número ou string)
 * @returns Número válido ou 0 se inválido
 */
export const parseValue = (value: number | string): number => {
  // Se já for número, retorna diretamente
  if (typeof value === 'number') return value;
  
  // Se for string vazia ou não definida, retorna 0
  if (!value) return 0;
  
  // Se for string, tenta converter para número
  const parsed = parseFloat(String(value).replace(/\./g, '').replace(',', '.'));
  
  // Retorna o valor convertido ou 0 se for NaN
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Formata um valor numérico para moeda brasileira
 */
export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

/**
 * Interface para parâmetros de cálculo - todos já são numéricos
 */
interface CalculateValuesParams {
  totalFatura: number;
  iluminacaoPublica: number;
  outrosValores: number;
  faturaConcessionaria: number;
  percentualDesconto: number;
  unidadeBeneficiariaId: string;
}

/**
 * Função principal de cálculo - todos os valores já são numéricos
 */
export const calculateValues = async (params: CalculateValuesParams) => {
  // Extrair parâmetros
  const { 
    totalFatura, 
    iluminacaoPublica, 
    outrosValores, 
    faturaConcessionaria,
    percentualDesconto,
    unidadeBeneficiariaId 
  } = params;
  
  console.log("[calculateValues] Valores para cálculo:", {
    totalFatura,
    iluminacaoPublica,
    outrosValores,
    faturaConcessionaria,
    percentualDesconto
  });
  
  // Verificação básica de valores
  if (isNaN(totalFatura) || isNaN(iluminacaoPublica) || isNaN(outrosValores) || 
      isNaN(faturaConcessionaria) || isNaN(percentualDesconto)) {
    console.error("Valores inválidos para cálculo");
    return {
      valorDesconto: 0,
      valorAssinatura: 0,
      economia: 0
    };
  }

  try {
    // Buscar template vinculado à unidade
    const { data: unidadeData, error: unidadeError } = await supabase.rpc('get_unidade_beneficiaria_template', {
      unidade_id: unidadeBeneficiariaId
    });

    if (unidadeError) {
      console.error("Erro ao buscar template da unidade:", unidadeError);
      throw unidadeError;
    }

    // Template de cálculo a ser utilizado
    let templateId = unidadeData?.length > 0 ? unidadeData[0].calculo_fatura_template_id : null;

    // Se a unidade não tiver template, buscar o padrão
    if (!templateId) {
      console.log("Unidade sem template, buscando template padrão");
      const { data: templatePadrao, error: erroPadrao } = await supabase.rpc('get_default_calculo_fatura_template');

      if (erroPadrao) {
        console.error("Erro ao buscar template padrão:", erroPadrao);
        throw erroPadrao;
      }

      if (templatePadrao && templatePadrao.length > 0) {
        templateId = templatePadrao[0].id;
      } else {
        // Se não houver template padrão, usar cálculo padrão
        console.warn("Nenhum template padrão encontrado, usando cálculo padrão");
        return calculoPadrao(totalFatura, iluminacaoPublica, outrosValores, faturaConcessionaria, percentualDesconto);
      }
    }

    // Buscar o template
    const { data: template, error: templateError } = await supabase.rpc('get_calculo_fatura_template', {
      template_id: templateId
    });

    if (templateError || !template || template.length === 0) {
      console.error("Erro ao buscar template:", templateError);
      // Se houver erro ou não encontrar o template, usar cálculo padrão
      return calculoPadrao(totalFatura, iluminacaoPublica, outrosValores, faturaConcessionaria, percentualDesconto);
    }

    const templateCalculo = template[0] as CalculoFaturaTemplate;
    console.log("[calculateValues] Template de cálculo encontrado:", templateCalculo);

    // Calcular usando as fórmulas do template
    const resultado = aplicarFormulasTemplate(
      templateCalculo,
      totalFatura,
      iluminacaoPublica,
      outrosValores,
      faturaConcessionaria,
      percentualDesconto
    );
    
    return resultado;
  } catch (error) {
    console.error("Erro no processo de cálculo:", error);
    // Em caso de qualquer erro, usar cálculo padrão
    return calculoPadrao(totalFatura, iluminacaoPublica, outrosValores, faturaConcessionaria, percentualDesconto);
  }
};

/**
 * Aplica as fórmulas do template para calcular os valores
 */
function aplicarFormulasTemplate(
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

/**
 * Avalia uma fórmula substituindo as variáveis pelos valores
 */
function avaliarFormula(formula: string, valores: Record<string, number>): number {
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

/**
 * Função simplificada para cálculo padrão
 */
function calculoPadrao(
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
