import * as z from "zod";

export const usinaFormSchema = z.object({
  unidade_usina_id: z.string().min(1, "Unidade é obrigatória"),
  valor_kwh: z.coerce
    .number()
    .min(0, "Valor deve ser maior que zero")
    .nonnegative("Valor não pode ser negativo"),
  dados_pagamento_nome: z.string().optional(),
  dados_pagamento_documento: z.string().optional(),
  dados_pagamento_banco: z.string().optional(),
  dados_pagamento_agencia: z.string().optional(),
  dados_pagamento_conta: z.string().optional(),
  dados_pagamento_telefone: z.string().optional(),
  dados_pagamento_email: z.string().email("Email inválido").optional().or(z.literal("")),
});

export type UsinaFormData = z.infer<typeof usinaFormSchema>;