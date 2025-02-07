
import * as z from "zod";
import { UF } from "./types";

const cepRegex = /^\d{5}-?\d{3}$/;
const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", 
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
] as const;

export const unidadeBeneficiariaFormSchema = z.object({
  numero_uc: z.string().min(1, "Número da UC é obrigatório"),
  apelido: z.string().optional(),
  cep: z.string().min(1, "CEP é obrigatório").regex(cepRegex, "CEP inválido"),
  logradouro: z.string().min(1, "Logradouro é obrigatório"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  uf: z.enum(UFS, {
    required_error: "UF é obrigatória",
  }),
  percentual_desconto: z.string().min(1, "Percentual de desconto é obrigatório"),
  data_entrada: z.string().min(1, "Data de entrada é obrigatória"),
  data_saida: z.string().optional(),
});
