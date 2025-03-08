
import { supabase } from "@/integrations/supabase/client";
import { CalculoFaturaTemplate } from "@/types/template";
import { toast } from "sonner";

// Função utilitária para converter valor formatado (ex: 1.234,56) para numérico (1234.56)
export const parseValue = (value: string): number => {
  if (!value) return 0;
  
  // Remove todos os caracteres não numéricos exceto virgula e ponto
  const sanitized = value.replace(/[^\d,.]/g, '');
  
  // Converte de formato BR para formato numérico
  const numeric = sanitized.replace(/\./g, '').replace(',', '.');
  
  return parseFloat(numeric) || 0;
};

// Função utilitária para formatar um valor numérico para formato de moeda BR
export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Interfaces para parâmetros
interface CalculateValuesParams {
  totalFatura: number | string;
  iluminacaoPublica: number | string;
  outrosValores: number | string;
  faturaConcessionaria: number | string;
  percentualDesconto: number | string;
  unidadeBeneficiariaId: string;
}

// Função principal para calcular valores da fatura
export const calculateValues = async (params: CalculateValuesParams) => {
  const { 
    totalFatura: totalFaturaParam, 
    iluminacaoPublica: iluminacaoPublicaParam, 
    outrosValores: outrosValoresParam, 
    faturaConcessionaria: faturaConcessionariaParam, 
    percentualDesconto: percentualDescontoParam, 
    unidadeBeneficiariaId 
  } = params;
  
  // Converter valores para número
  const totalFatura = typeof totalFaturaParam === 'string' ? parseValue(totalFaturaParam) : totalFaturaParam;
  const iluminacaoPublica = typeof iluminacaoPublicaParam === 'string' ? parseValue(iluminacaoPublicaParam) : iluminacaoPublicaParam;
  const outrosValores = typeof outrosValoresParam === 'string' ? parseValue(outrosValoresParam) : outrosValoresParam;
  const faturaConcessionaria = typeof faturaConcessionariaParam === 'string' ? parseValue(faturaConcessionariaParam) : faturaConcessionariaParam;
  const percentualDesconto = typeof percentualDescontoParam === 'string' ? parseValue(percentualDescontoParam) : percentualDescontoParam;

  try {
    // Buscar o template vinculado à unidade beneficiária
    const { data: unidadeData, error: unidadeError } = await supabase.rpc('get_unidade_beneficiaria_template', {
      unidade_id: unidadeBeneficiariaId
    });

    if (unidadeError) {
      console.error("Erro ao buscar template da unidade:", unidadeError);
      throw unidadeError;
    }

    // Template de cálculo a ser utilizado
    let templateId = unidadeData?.length > 0 ? unidadeData[0].calculo_fatura_template_id : null;

    // Se a unidade não tiver um template associado, buscar o template padrão
    if (!templateId) {
      console.log("Unidade sem template, buscando padrão");
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
        return calculoPadrao({
          totalFatura,
          iluminacaoPublica,
          outrosValores,
          faturaConcessionaria,
          percentualDesconto
        });
      }
    }

    // Buscar o template
    const { data: template, error: templateError } = await supabase.rpc('get_calculo_fatura_template', {
      template_id: templateId
    });

    if (templateError || !template || template.length === 0) {
      console.error("Erro ao buscar template:", templateError);
      // Se houver erro ou não encontrar o template, usar cálculo padrão
      return calculoPadrao({
        totalFatura,
        iluminacaoPublica,
        outrosValores,
        faturaConcessionaria,
        percentualDesconto
      });
    }

    const templateCalculo = template[0] as CalculoFaturaTemplate;

    // Calcular valor de desconto usando a fórmula do template
    let valorDesconto = 0;
    try {
      valorDesconto = calcularComFormula(
        templateCalculo.formula_valor_desconto,
        {
          total_fatura: totalFatura,
          iluminacao_publica: iluminacaoPublica,
          outros_valores: outrosValores,
          fatura_concessionaria: faturaConcessionaria,
          percentual_desconto: percentualDesconto
        }
      );
    } catch (error) {
      console.error("Erro ao calcular valor de desconto:", error);
      toast.error("Erro no cálculo do desconto. Usando método padrão.");
      
      // Usar cálculo padrão para o desconto
      valorDesconto = (totalFatura - iluminacaoPublica - outrosValores) * (percentualDesconto / 100);
    }

    // Calcular valor da assinatura usando a fórmula do template
    let valorAssinatura = 0;
    try {
      valorAssinatura = calcularComFormula(
        templateCalculo.formula_valor_assinatura,
        {
          total_fatura: totalFatura,
          iluminacao_publica: iluminacaoPublica,
          outros_valores: outrosValores,
          fatura_concessionaria: faturaConcessionaria,
          percentual_desconto: percentualDesconto,
          valor_desconto: valorDesconto
        }
      );
    } catch (error) {
      console.error("Erro ao calcular valor de assinatura:", error);
      toast.error("Erro no cálculo da assinatura. Usando método padrão.");
      
      // Usar cálculo padrão para a assinatura
      valorAssinatura = totalFatura - valorDesconto - faturaConcessionaria;
    }

    // Calcular economia
    const economia = valorDesconto;

    return {
      valorDesconto,
      valorAssinatura,
      economia
    };
  } catch (error) {
    console.error("Erro ao calcular valores da fatura:", error);
    // Em caso de falha, usar o cálculo padrão
    return calculoPadrao({
      totalFatura,
      iluminacaoPublica,
      outrosValores,
      faturaConcessionaria,
      percentualDesconto
    });
  }
};

// Função para calcular usando uma fórmula
const calcularComFormula = (
  formula: string,
  valores: {
    total_fatura: number;
    iluminacao_publica: number;
    outros_valores: number;
    fatura_concessionaria: number;
    percentual_desconto: number;
    valor_desconto?: number;
  }
): number => {
  let formulaProcessada = formula;

  // Substituir variáveis da fórmula pelos valores
  Object.entries(valores).forEach(([chave, valor]) => {
    if (valor !== undefined) {
      formulaProcessada = formulaProcessada.replace(
        new RegExp(chave, 'g'),
        valor.toString()
      );
    }
  });

  try {
    // Avaliar a fórmula
    // eslint-disable-next-line no-eval
    const resultado = eval(formulaProcessada);
    return isNaN(resultado) ? 0 : resultado;
  } catch (error) {
    console.error("Erro ao avaliar fórmula:", error);
    throw new Error("Erro ao avaliar fórmula de cálculo");
  }
};

// Interface para parâmetros de cálculo padrão
interface CalculoPadraoParams {
  totalFatura: number;
  iluminacaoPublica: number;
  outrosValores: number;
  faturaConcessionaria: number;
  percentualDesconto: number;
}

// Função para o cálculo padrão (usado como fallback)
const calculoPadrao = (params: CalculoPadraoParams) => {
  const { totalFatura, iluminacaoPublica, outrosValores, faturaConcessionaria, percentualDesconto } = params;
  
  const baseCalculo = totalFatura - iluminacaoPublica - outrosValores;
  const valorDesconto = baseCalculo * (percentualDesconto / 100);
  const valorAssinatura = totalFatura - valorDesconto - faturaConcessionaria;
  const economia = valorDesconto;

  return {
    valorDesconto,
    valorAssinatura,
    economia
  };
};
