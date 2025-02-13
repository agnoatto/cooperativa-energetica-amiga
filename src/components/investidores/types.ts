
import { z } from "zod";

export const investidorFormSchema = z.object({
  nome_investidor: z.string().min(1, "Nome do investidor é obrigatório"),
  documento: z.string().min(14, "CPF/CNPJ é obrigatório"),
  telefone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
});

export type InvestidorFormData = z.infer<typeof investidorFormSchema>;
