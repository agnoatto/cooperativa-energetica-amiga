
export interface CalculoFaturaTemplate {
  id: string;
  nome: string;
  descricao?: string;
  formula_valor_desconto: string;
  formula_valor_assinatura: string;
  campos_personalizados?: any[];
  is_padrao: boolean;
  created_at?: string;
  updated_at?: string;
}
