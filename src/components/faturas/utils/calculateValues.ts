
/**
 * Utilitários para cálculo de valores das faturas
 * 
 * Este módulo centraliza a lógica de cálculo de faturas,
 * utilizando templates personalizados ou cálculo padrão conforme necessário.
 */

import { toast } from "sonner";
import { CalculoFaturaTemplate } from "@/types/template";
import { calculoPadrao } from "./calculoPadrao";
import { aplicarFormulasTemplate } from "./templateProcessor";
import { parseValue } from "./formatters";
import { 
  getUnidadeTemplate,
  getDefaultTemplate,
  getTemplateById,
  getUnidadePercentualDesconto
} from "./templateQueries";

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
    const { templateId: unidadeTemplateId, error: unidadeError } = 
      await getUnidadeTemplate(unidadeBeneficiariaId);

    if (unidadeError) {
      console.error("Erro ao buscar template da unidade:", unidadeError);
      throw unidadeError;
    }

    // Template de cálculo a ser utilizado
    let templateId = unidadeTemplateId;

    // Se a unidade não tiver template, buscar o padrão
    if (!templateId) {
      console.log("Unidade sem template, buscando template padrão");
      const { templateId: defaultTemplateId, error: erroPadrao } = 
        await getDefaultTemplate();

      if (erroPadrao) {
        console.error("Erro ao buscar template padrão:", erroPadrao);
        throw erroPadrao;
      }

      templateId = defaultTemplateId;
      
      if (!templateId) {
        // Se não houver template padrão, usar cálculo padrão
        console.warn("Nenhum template padrão encontrado, usando cálculo padrão");
        return calculoPadrao(totalFatura, iluminacaoPublica, outrosValores, faturaConcessionaria, percentualDesconto);
      }
    }

    // Buscar o template
    const { template, error: templateError } = await getTemplateById(templateId);

    if (templateError || !template) {
      console.error("Erro ao buscar template:", templateError);
      // Se houver erro ou não encontrar o template, usar cálculo padrão
      return calculoPadrao(totalFatura, iluminacaoPublica, outrosValores, faturaConcessionaria, percentualDesconto);
    }

    console.log("[calculateValues] Template de cálculo encontrado:", template);

    // Calcular usando as fórmulas do template
    return aplicarFormulasTemplate(
      template,
      totalFatura,
      iluminacaoPublica,
      outrosValores,
      faturaConcessionaria,
      percentualDesconto
    );
    
  } catch (error) {
    console.error("Erro no processo de cálculo:", error);
    // Em caso de qualquer erro, usar cálculo padrão
    return calculoPadrao(totalFatura, iluminacaoPublica, outrosValores, faturaConcessionaria, percentualDesconto);
  }
};

// Re-exportar as funções que precisam ser acessíveis externamente
export { parseValue, formatCurrency } from "./formatters";
