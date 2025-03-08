export interface CalculoFaturaTemplate {
  id: string;
  nome: string;
  descricao?: string | null;
  formula_valor_desconto: string;
  formula_valor_assinatura: string;
  is_padrao: boolean;
  created_at?: string;
  updated_at?: string;
}

export type CreateCalculoFaturaTemplateInput = Omit<CalculoFaturaTemplate, "id" | "created_at" | "updated_at">;
