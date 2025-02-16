
import * as z from "zod";

export const usinaFormSchema = z.object({
  investidor_id: z.string().min(1, "Investidor é obrigatório"),
  unidade_usina_id: z.string().min(1, "Unidade é obrigatória"),
  valor_kwh: z.number()
    .min(0, "Valor deve ser maior que zero")
    .nonnegative("Valor não pode ser negativo"),
  potencia_instalada: z.number()
    .min(0, "Potência deve ser maior que zero")
    .nonnegative("Potência não pode ser negativa")
    .optional(),
  data_inicio: z.coerce.date().optional(),
  dados_pagamento_nome: z.string().optional(),
  dados_pagamento_documento: z.string().optional(),
  dados_pagamento_banco: z.string().optional(),
  dados_pagamento_agencia: z.string().optional(),
  dados_pagamento_conta: z.string().optional(),
  dados_pagamento_telefone: z.string().optional(),
  dados_pagamento_email: z.string().email("Email inválido").optional().or(z.literal("")),
  dados_pagamento_chave_pix: z.string().optional(),
  dados_pagamento_tipo_chave_pix: z.enum(['cpf', 'cnpj', 'email', 'telefone', 'aleatoria']).optional(),
});

export type UsinaFormData = z.infer<typeof usinaFormSchema>;

export const geracaoPrevisaoSchema = z.object({
  ano: z.number().min(2000).max(2100),
  janeiro: z.number().min(0).optional(),
  fevereiro: z.number().min(0).optional(),
  marco: z.number().min(0).optional(),
  abril: z.number().min(0).optional(),
  maio: z.number().min(0).optional(),
  junho: z.number().min(0).optional(),
  julho: z.number().min(0).optional(),
  agosto: z.number().min(0).optional(),
  setembro: z.number().min(0).optional(),
  outubro: z.number().min(0).optional(),
  novembro: z.number().min(0).optional(),
  dezembro: z.number().min(0).optional(),
});

export type GeracaoPrevisaoFormData = z.infer<typeof geracaoPrevisaoSchema>;
