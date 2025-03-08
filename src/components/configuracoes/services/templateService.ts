
import { supabase } from "@/integrations/supabase/client";
import { CalculoFaturaTemplate } from "@/types/template";

// Função para buscar todos os templates
export async function fetchTemplates(): Promise<CalculoFaturaTemplate[]> {
  try {
    // Usando a API REST do Supabase para acessar a tabela
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yvripyhfwglzjbaxtowl.supabase.co"}/rest/v1/calculo_fatura_templates?select=*&order=is_padrao.desc,nome.asc`,
      {
        headers: {
          "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2cmlweWhmd2dsempiYXh0b3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2NzI4NDEsImV4cCI6MjA1NDI0ODg0MX0.CD-GdAPYCoKLgrAIKYmtGhJrJqzH6AVtMnZv98jaKc0",
          "Content-Type": "application/json",
          "Prefer": "return=representation"
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar templates: ${response.status}`);
    }
    
    const data = await response.json();
    return data as CalculoFaturaTemplate[];
  } catch (error: any) {
    console.error("Erro ao buscar templates:", error);
    return [];
  }
}

// Função para buscar um template por ID
export async function fetchTemplateById(id: string): Promise<CalculoFaturaTemplate | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yvripyhfwglzjbaxtowl.supabase.co"}/rest/v1/calculo_fatura_templates?id=eq.${id}&select=*`,
      {
        headers: {
          "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2cmlweWhmd2dsempiYXh0b3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2NzI4NDEsImV4cCI6MjA1NDI0ODg0MX0.CD-GdAPYCoKLgrAIKYmtGhJrJqzH6AVtMnZv98jaKc0",
          "Content-Type": "application/json"
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar template: ${response.status}`);
    }
    
    const data = await response.json();
    return data.length > 0 ? data[0] as CalculoFaturaTemplate : null;
  } catch (error: any) {
    console.error("Erro ao buscar template por ID:", error);
    return null;
  }
}

// Função para criar um novo template
export async function createTemplate(template: Omit<CalculoFaturaTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<CalculoFaturaTemplate | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yvripyhfwglzjbaxtowl.supabase.co"}/rest/v1/calculo_fatura_templates`,
      {
        method: 'POST',
        headers: {
          "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2cmlweWhmd2dsempiYXh0b3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2NzI4NDEsImV4cCI6MjA1NDI0ODg0MX0.CD-GdAPYCoKLgrAIKYmtGhJrJqzH6AVtMnZv98jaKc0",
          "Content-Type": "application/json",
          "Prefer": "return=representation"
        },
        body: JSON.stringify(template)
      }
    );
    
    if (!response.ok) {
      throw new Error(`Erro ao criar template: ${response.status}`);
    }
    
    const data = await response.json();
    return data[0] as CalculoFaturaTemplate;
  } catch (error: any) {
    console.error("Erro ao criar template:", error);
    return null;
  }
}

// Função para atualizar um template existente
export async function updateTemplate(id: string, template: Partial<CalculoFaturaTemplate>): Promise<CalculoFaturaTemplate | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yvripyhfwglzjbaxtowl.supabase.co"}/rest/v1/calculo_fatura_templates?id=eq.${id}`,
      {
        method: 'PATCH',
        headers: {
          "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2cmlweWhmd2dsempiYXh0b3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2NzI4NDEsImV4cCI6MjA1NDI0ODg0MX0.CD-GdAPYCoKLgrAIKYmtGhJrJqzH6AVtMnZv98jaKc0",
          "Content-Type": "application/json",
          "Prefer": "return=representation"
        },
        body: JSON.stringify(template)
      }
    );
    
    if (!response.ok) {
      throw new Error(`Erro ao atualizar template: ${response.status}`);
    }
    
    const data = await response.json();
    return data.length > 0 ? data[0] as CalculoFaturaTemplate : null;
  } catch (error: any) {
    console.error("Erro ao atualizar template:", error);
    return null;
  }
}

// Função para deletar um template
export async function deleteTemplate(id: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yvripyhfwglzjbaxtowl.supabase.co"}/rest/v1/calculo_fatura_templates?id=eq.${id}`,
      {
        method: 'DELETE',
        headers: {
          "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2cmlweWhmd2dsempiYXh0b3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2NzI4NDEsImV4cCI6MjA1NDI0ODg0MX0.CD-GdAPYCoKLgrAIKYmtGhJrJqzH6AVtMnZv98jaKc0"
        }
      }
    );
    
    return response.ok;
  } catch (error: any) {
    console.error("Erro ao deletar template:", error);
    return false;
  }
}

// Função para verificar se um template está sendo usado por unidades beneficiárias
export async function checkTemplateInUse(templateId: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yvripyhfwglzjbaxtowl.supabase.co"}/rest/v1/unidades_beneficiarias?calculo_fatura_template_id=eq.${templateId}&select=id&limit=1`,
      {
        headers: {
          "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2cmlweWhmd2dsempiYXh0b3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2NzI4NDEsImV4cCI6MjA1NDI0ODg0MX0.CD-GdAPYCoKLgrAIKYmtGhJrJqzH6AVtMnZv98jaKc0",
          "Content-Type": "application/json"
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Erro ao verificar uso do template: ${response.status}`);
    }
    
    const data = await response.json();
    return data.length > 0;
  } catch (error: any) {
    console.error("Erro ao verificar uso do template:", error);
    return false;
  }
}

// Função para resetar templates padrão (exceto o selecionado)
export async function resetDefaultTemplates(exceptId: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yvripyhfwglzjbaxtowl.supabase.co"}/rest/v1/calculo_fatura_templates?id=neq.${exceptId}&is_padrao=eq.true`,
      {
        method: 'PATCH',
        headers: {
          "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2cmlweWhmd2dsempiYXh0b3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2NzI4NDEsImV4cCI6MjA1NDI0ODg0MX0.CD-GdAPYCoKLgrAIKYmtGhJrJqzH6AVtMnZv98jaKc0",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ is_padrao: false })
      }
    );
    
    return response.ok;
  } catch (error: any) {
    console.error("Erro ao resetar templates padrão:", error);
    return false;
  }
}

// Função para buscar o template padrão
export async function fetchDefaultTemplate(): Promise<CalculoFaturaTemplate | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yvripyhfwglzjbaxtowl.supabase.co"}/rest/v1/calculo_fatura_templates?is_padrao=eq.true&select=*&limit=1`,
      {
        headers: {
          "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2cmlweWhmd2dsempiYXh0b3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2NzI4NDEsImV4cCI6MjA1NDI0ODg0MX0.CD-GdAPYCoKLgrAIKYmtGhJrJqzH6AVtMnZv98jaKc0",
          "Content-Type": "application/json"
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar template padrão: ${response.status}`);
    }
    
    const data = await response.json();
    return data.length > 0 ? data[0] as CalculoFaturaTemplate : null;
  } catch (error: any) {
    console.error("Erro ao buscar template padrão:", error);
    return null;
  }
}
