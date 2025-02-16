
import { z } from "zod";

export const unidadeUsinaFormSchema = z.object({
  numero_uc: z.string().min(1, "Número UC é obrigatório"),
  apelido: z.string().optional(),
  logradouro: z.string().min(1, "Logradouro é obrigatório"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  uf: z.string().min(2, "UF é obrigatória").max(2, "UF deve ter 2 caracteres"),
  cep: z.string().min(8, "CEP é obrigatório").max(9, "CEP inválido"),
  titular_id: z.string().min(1, "Titular é obrigatório"),
  titular_tipo: z.enum(["cooperado", "cooperativa"]),
});

export type UnidadeUsinaFormData = z.infer<typeof unidadeUsinaFormSchema>;
