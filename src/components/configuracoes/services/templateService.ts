
import { supabase } from "@/integrations/supabase/client";
import { CalculoFaturaTemplate, CreateCalculoFaturaTemplateInput } from "@/types/template";

// Função para buscar templates de cálculo
export const fetchTemplates = async (): Promise<CalculoFaturaTemplate[]> => {
  try {
    // Consulta direta com RPC para evitar problemas de tipagem
    const { data, error } = await supabase.rpc('get_all_calculo_fatura_templates');
    
    if (error) {
      console.error("Erro ao buscar templates:", error);
      throw error;
    }
    
    return data as CalculoFaturaTemplate[];
  } catch (error) {
    console.error("Erro ao buscar templates:", error);
    throw error;
  }
};

// Função para verificar se um template está em uso
export const checkTemplateInUse = async (templateId: string): Promise<boolean> => {
  try {
    // Consulta direta com RPC para evitar problemas de tipagem
    const { data, error } = await supabase.rpc('check_template_in_use', {
      template_id: templateId
    });
    
    if (error) {
      console.error("Erro ao verificar uso do template:", error);
      throw error;
    }
    
    return data as boolean;
  } catch (error) {
    console.error("Erro ao verificar uso do template:", error);
    throw error;
  }
};

// Função para criar um novo template
export const createTemplate = async (template: CreateCalculoFaturaTemplateInput): Promise<CalculoFaturaTemplate | null> => {
  try {
    // Consulta direta com RPC para evitar problemas de tipagem
    const { data, error } = await supabase.rpc('create_calculo_fatura_template', {
      nome_template: template.nome,
      descricao_template: template.descricao || null,
      formula_desconto: template.formula_valor_desconto,
      formula_assinatura: template.formula_valor_assinatura,
      padrao: template.is_padrao
    });
    
    if (error) {
      console.error("Erro ao criar template:", error);
      throw error;
    }
    
    return data as CalculoFaturaTemplate;
  } catch (error) {
    console.error("Erro ao criar template:", error);
    throw error;
  }
};

// Função para atualizar um template existente
export const updateTemplate = async (id: string, template: Partial<CreateCalculoFaturaTemplateInput>): Promise<CalculoFaturaTemplate | null> => {
  try {
    // Consulta direta com RPC para evitar problemas de tipagem
    const { data, error } = await supabase.rpc('update_calculo_fatura_template', {
      template_id: id,
      nome_template: template.nome,
      descricao_template: template.descricao || null,
      formula_desconto: template.formula_valor_desconto,
      formula_assinatura: template.formula_valor_assinatura,
      padrao: template.is_padrao
    });
    
    if (error) {
      console.error("Erro ao atualizar template:", error);
      throw error;
    }
    
    return data as CalculoFaturaTemplate;
  } catch (error) {
    console.error("Erro ao atualizar template:", error);
    throw error;
  }
};

// Função para excluir um template
export const deleteTemplate = async (id: string): Promise<boolean> => {
  try {
    // Consulta direta com RPC para evitar problemas de tipagem
    const { data, error } = await supabase.rpc('delete_calculo_fatura_template', {
      template_id: id
    });
    
    if (error) {
      console.error("Erro ao excluir template:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Erro ao excluir template:", error);
    throw error;
  }
};

// Função para redefinir os templates padrão, mantendo apenas um como padrão
export const resetDefaultTemplates = async (exceptId: string): Promise<boolean> => {
  try {
    // Consulta direta com RPC para evitar problemas de tipagem
    const { data, error } = await supabase.rpc('reset_default_templates', {
      except_id: exceptId
    });
    
    if (error) {
      console.error("Erro ao redefinir templates padrão:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Erro ao redefinir templates padrão:", error);
    throw error;
  }
};
