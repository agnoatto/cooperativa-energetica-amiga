
import * as z from "zod";

export const cooperadoFormSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  documento: z.string().min(11, "CPF/CNPJ inválido"),
  tipo_pessoa: z.enum(["PF", "PJ"]),
  telefone: z.string().min(10, "Telefone inválido"),
  email: z.string().email("Email inválido"),
  responsavel_nome: z.string().optional(),
  responsavel_cpf: z.string().optional(),
  responsavel_telefone: z.string().optional(),
  numero_cadastro: z.string().optional(),
});

export type CooperadoFormValues = z.infer<typeof cooperadoFormSchema>;
