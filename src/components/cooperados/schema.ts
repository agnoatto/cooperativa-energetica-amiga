
import * as z from "zod";

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
const telefoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;

const validateDocumento = (value: string, tipo: "PF" | "PJ") => {
  const cleanValue = value.replace(/\D/g, '');
  
  if (tipo === "PF" && cleanValue.length !== 11) {
    return false;
  }
  
  if (tipo === "PJ" && cleanValue.length !== 14) {
    return false;
  }

  return true;
};

export const cooperadoFormSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  documento: z.string()
    .min(11, "Documento inválido")
    .refine((val) => val.replace(/\D/g, '').length >= 11, "Documento inválido"),
  tipo_pessoa: z.enum(["PF", "PJ"]),
  telefone: z.string()
    .min(10, "Telefone inválido")
    .refine((val) => telefoneRegex.test(val) || val.replace(/\D/g, '').length >= 10, "Formato inválido: (99) 99999-9999"),
  email: z.string().email("Email inválido"),
  responsavel_nome: z.string().optional(),
  responsavel_cpf: z.string()
    .optional()
    .refine((val) => !val || cpfRegex.test(val) || val.replace(/\D/g, '').length === 11, "CPF inválido"),
  responsavel_telefone: z.string()
    .optional()
    .refine((val) => !val || telefoneRegex.test(val) || val.replace(/\D/g, '').length >= 10, "Formato inválido: (99) 99999-9999"),
  numero_cadastro: z.string().optional(),
});

export type CooperadoFormValues = z.infer<typeof cooperadoFormSchema>;
