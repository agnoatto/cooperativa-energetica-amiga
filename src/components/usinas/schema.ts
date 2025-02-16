
import * as z from "zod";

export const usinaFormSchema = z.object({
  investidor_id: z.string().min(1, "Investidor é obrigatório"),
  unidade_usina_id: z.string().min(1, "Unidade é obrigatória"),
  valor_kwh: z.number()
    .min(0, "Valor deve ser maior que zero")
    .nonnegative("Valor não pode ser negativo"),
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
