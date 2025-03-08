
import { supabase } from "@/integrations/supabase/client";

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

export const getCalculoTemplate = async (unidadeBeneficiariaId: string) => {
  try {
    // Buscar o template associado à unidade beneficiária
    const { data: unidade, error: unidadeError } = await supabase
      .from("unidades_beneficiarias")
      .select("calculo_fatura_template_id")
      .eq("id", unidadeBeneficiariaId)
      .single();

    if (unidadeError) throw unidadeError;

    let templateId = unidade?.calculo_fatura_template_id;
    
    // Se a unidade não tem template específico, buscar o padrão
    if (!templateId) {
      const { data: templatePadrao, error: templatePadraoError } = await supabase
        .from("calculo_fatura_templates")
        .select("id")
        .eq("is_padrao", true)
        .single();

      if (templatePadraoError) throw templatePadraoError;
      
      templateId = templatePadrao?.id;
    }

    // Buscar detalhes do template
    const { data: template, error: templateError } = await supabase
      .from("calculo_fatura_templates")
      .select("*")
      .eq("id", templateId)
      .single();

    if (templateError) throw templateError;

    return template;
  } catch (error) {
    console.error('[getCalculoTemplate] Erro ao buscar template:', error);
    // Retornar fórmulas padrão em caso de erro
    return {
      formula_valor_desconto: "(total_fatura - iluminacao_publica - outros_valores) * (percentual_desconto / 100)",
      formula_valor_assinatura: "total_fatura - valor_desconto - fatura_concessionaria"
    };
  }
};

export const calculateValues = async (
  totalFatura: string,
  iluminacaoPublica: string,
  outrosValores: string,
  faturaConcessionaria: string,
  percentualDesconto: number,
  unidadeBeneficiariaId: string
) => {
  console.log('[calculateValues] Valores recebidos para cálculo:', {
    totalFatura,
    iluminacaoPublica,
    outrosValores,
    faturaConcessionaria,
    percentualDesconto,
    unidadeBeneficiariaId,
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

  try {
    // Buscar o template de cálculo
    const template = await getCalculoTemplate(unidadeBeneficiariaId);
    console.log('[calculateValues] Template encontrado:', template);

    // Preparar os parâmetros para a avaliação da fórmula
    const params = {
      total_fatura: total,
      iluminacao_publica: iluminacao,
      outros_valores: outros,
      fatura_concessionaria: concessionaria,
      percentual_desconto: percentualDesconto
    };

    // Calcular o valor do desconto
    let valorDesconto = 0;
    try {
      // Avaliar a fórmula de desconto substituindo as variáveis
      let formula = template.formula_valor_desconto;
      Object.entries(params).forEach(([key, value]) => {
        formula = formula.replace(new RegExp(key, 'g'), value.toString());
      });
      valorDesconto = eval(formula);
      valorDesconto = parseFloat(valorDesconto.toFixed(2));
    } catch (error) {
      console.error('[calculateValues] Erro ao calcular desconto:', error);
      // Usar o cálculo padrão em caso de erro
      const baseDesconto = total - iluminacao - outros;
      valorDesconto = parseFloat((baseDesconto * (percentualDesconto / 100)).toFixed(2));
    }

    // Calcular o valor da assinatura
    let valorAssinatura = 0;
    try {
      // Avaliar a fórmula de assinatura substituindo as variáveis (incluindo o valor_desconto)
      let formula = template.formula_valor_assinatura;
      Object.entries({...params, valor_desconto: valorDesconto}).forEach(([key, value]) => {
        formula = formula.replace(new RegExp(key, 'g'), value.toString());
      });
      valorAssinatura = eval(formula);
      valorAssinatura = parseFloat(valorAssinatura.toFixed(2));
    } catch (error) {
      console.error('[calculateValues] Erro ao calcular assinatura:', error);
      // Usar o cálculo padrão em caso de erro
      valorAssinatura = parseFloat((total - valorDesconto - concessionaria).toFixed(2));
    }

    console.log('[calculateValues] Valores calculados:', {
      valorDesconto,
      valorAssinatura
    });

    return {
      valor_desconto: valorDesconto,
      valor_assinatura: valorAssinatura
    };
  } catch (error) {
    console.error('[calculateValues] Erro ao calcular valores:', error);
    
    // Cálculo padrão em caso de erro
    const percentual = percentualDesconto / 100;
    const baseDesconto = total - iluminacao - outros;
    const valorDesconto = parseFloat((baseDesconto * percentual).toFixed(2));
    const valorAssinatura = parseFloat((total - valorDesconto - concessionaria).toFixed(2));

    return {
      valor_desconto: valorDesconto,
      valor_assinatura: valorAssinatura
    };
  }
};
