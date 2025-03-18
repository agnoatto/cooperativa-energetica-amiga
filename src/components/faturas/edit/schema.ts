
/**
 * Schema de validação para o formulário de edição de faturas
 * 
 * Define as regras de validação utilizando Zod para garantir
 * a integridade dos dados inseridos pelo usuário.
 */
import { z } from "zod";

export const editFaturaSchema = z.object({
  consumo_kwh: z.string().min(1, { message: "Consumo é obrigatório" }),
  data_vencimento: z.string().min(1, { message: "Data de vencimento é obrigatória" }),
  data_proxima_leitura: z.string().optional(),
  economia_acumulada: z.string().optional(),
  saldo_energia_kwh: z.string().optional(),
  observacao: z.string().optional(),
});

export type EditFaturaFormData = z.infer<typeof editFaturaSchema>;
