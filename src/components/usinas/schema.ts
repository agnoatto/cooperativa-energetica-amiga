
import * as z from "zod";

export const usinaFormSchema = z.object({
  investidor_id: z.string().min(1, "Investidor é obrigatório"),
  unidade_usina_id: z.string().min(1, "Unidade é obrigatória"),
  valor_kwh: z.coerce
    .number()
    .min(0, "Valor deve ser maior que zero")
    .nonnegative("Valor não pode ser negativo"),
  dados_pagamento_nome: z.string().min(1, "Nome é obrigatório"),
  dados_pagamento_documento: z.string().min(1, "Documento é obrigatório"),
  dados_pagamento_banco: z.string().min(1, "Banco é obrigatório"),
  dados_pagamento_agencia: z.string().min(1, "Agência é obrigatória"),
  dados_pagamento_conta: z.string().min(1, "Conta é obrigatória"),
  dados_pagamento_telefone: z.string().optional(),
  dados_pagamento_email: z.string().email("Email inválido").optional().or(z.literal("")),
});

export type UsinaFormData = z.infer<typeof usinaFormSchema>;

