
/**
 * Funções de consulta ao Supabase para templates de cálculo
 * 
 * Este módulo centraliza todas as consultas relacionadas a templates de cálculo
 * para manter o código organizado e facilitar a manutenção.
 */

import { supabase } from "@/integrations/supabase/client";
import { CalculoFaturaTemplate } from "@/types/template";
import { toast } from "sonner";

/**
 * Busca o template vinculado a uma unidade beneficiária
 * @param unidadeBeneficiariaId ID da unidade beneficiária
 * @returns Template associado à unidade ou nulo
 */
export async function getUnidadeTemplate(unidadeBeneficiariaId: string): Promise<{ templateId: string | null, error: any }> {
  console.log("[getUnidadeTemplate] Buscando template para unidade:", unidadeBeneficiariaId);
  
  try {
    const { data, error } = await supabase.rpc('get_unidade_beneficiaria_template', {
      unidade_id: unidadeBeneficiariaId
    });

    if (error) {
      console.error("Erro ao buscar template da unidade:", error);
      return { templateId: null, error };
    }

    const templateId = data?.length > 0 ? data[0].calculo_fatura_template_id : null;
    console.log("[getUnidadeTemplate] Template encontrado:", templateId);
    
    return { templateId, error: null };
  } catch (error) {
    console.error("Erro ao buscar template da unidade:", error);
    return { templateId: null, error };
  }
}

/**
 * Busca o template padrão de cálculo
 * @returns Template padrão ou nulo
 */
export async function getDefaultTemplate(): Promise<{ templateId: string | null, error: any }> {
  console.log("[getDefaultTemplate] Buscando template padrão");
  
  try {
    const { data, error } = await supabase.rpc('get_default_calculo_fatura_template');

    if (error) {
      console.error("Erro ao buscar template padrão:", error);
      return { templateId: null, error };
    }

    const templateId = data && data.length > 0 ? data[0].id : null;
    console.log("[getDefaultTemplate] Template padrão encontrado:", templateId);
    
    return { templateId, error: null };
  } catch (error) {
    console.error("Erro ao buscar template padrão:", error);
    return { templateId: null, error };
  }
}

/**
 * Busca um template específico pelo ID
 * @param templateId ID do template a ser buscado
 * @returns Dados do template ou nulo em caso de erro
 */
export async function getTemplateById(templateId: string): Promise<{ template: CalculoFaturaTemplate | null, error: any }> {
  console.log("[getTemplateById] Buscando template:", templateId);
  
  try {
    const { data, error } = await supabase.rpc('get_calculo_fatura_template', {
      template_id: templateId
    });

    if (error || !data || data.length === 0) {
      console.error("Erro ao buscar template:", error);
      return { template: null, error: error || new Error("Template não encontrado") };
    }

    const template = data[0] as CalculoFaturaTemplate;
    console.log("[getTemplateById] Template encontrado:", template.nome);
    
    return { template, error: null };
  } catch (error) {
    console.error("Erro ao buscar template:", error);
    return { template: null, error };
  }
}

/**
 * Busca o percentual de desconto de uma unidade beneficiária
 * @param unidadeBeneficiariaId ID da unidade beneficiária
 * @returns Percentual de desconto ou 0 em caso de erro
 */
export async function getUnidadePercentualDesconto(unidadeBeneficiariaId: string): Promise<{ percentualDesconto: number, error: any }> {
  console.log("[getUnidadePercentualDesconto] Buscando percentual para unidade:", unidadeBeneficiariaId);
  
  try {
    const { data, error } = await supabase
      .from('unidades_beneficiarias')
      .select('percentual_desconto')
      .eq('id', unidadeBeneficiariaId)
      .single();
    
    if (error) {
      console.error("Erro ao buscar percentual de desconto:", error);
      return { percentualDesconto: 0, error };
    }
    
    const percentualDesconto = data?.percentual_desconto || 0;
    console.log("[getUnidadePercentualDesconto] Percentual encontrado:", percentualDesconto);
    
    return { percentualDesconto, error: null };
  } catch (error) {
    console.error("Erro ao buscar percentual de desconto:", error);
    return { percentualDesconto: 0, error };
  }
}
