
import { z } from "zod";

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
const telefoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
const cepRegex = /^\d{5}-?\d{3}$/;

const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", 
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
] as const;

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

// Modificando o schema para trabalhar com strings para valores numéricos
export const unidadeBeneficiariaFormSchema = z.object({
  numero_uc: z.string().min(1, { message: "Número da UC é obrigatório" }),
  apelido: z.string().optional(),
  cep: z.string().min(1, { message: "CEP é obrigatório" }).regex(cepRegex, "CEP inválido"),
  logradouro: z.string().min(1, { message: "Logradouro é obrigatório" }),
  numero: z.string().min(1, { message: "Número é obrigatório" }),
  complemento: z.string().optional(),
  bairro: z.string().min(1, { message: "Bairro é obrigatório" }),
  cidade: z.string().min(1, { message: "Cidade é obrigatória" }),
  uf: z.enum(UFS, {
    required_error: "UF é obrigatória",
  }),
  percentual_desconto: z.string().min(1, { message: "Percentual de desconto é obrigatório" }),
  data_entrada: z.string().min(1, { message: "Data de entrada é obrigatória" }),
  data_saida: z.string().optional(),
  consumo_kwh: z.string().optional(),
  possui_geracao_propria: z.boolean().default(false),
  potencia_instalada: z.number().optional().nullable(),
  data_inicio_geracao: z.string().optional().nullable(),
  observacao_geracao: z.string().optional().nullable(),
  recebe_creditos_proprios: z.boolean().default(false),
  uc_origem_creditos: z.string().optional().nullable(),
  data_inicio_creditos: z.string().optional().nullable(),
  observacao_creditos: z.string().optional().nullable(),
  calculo_fatura_template_id: z.string().optional(),
});

export const UnidadeBeneficiariaSchema = z.object({
  numero_uc: z.string().min(1, {
    message: "Número da UC é obrigatório",
  }),
  apelido: z.string().optional(),
  endereco: z.string().min(1, {
    message: "Endereço é obrigatório",
  }),
  cep: z.string().optional(),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  uf: z.string().optional(),
  percentual_desconto: z.number().min(0, {
    message: "Percentual de desconto deve ser maior ou igual a 0",
  }).max(100, {
    message: "Percentual de desconto deve ser menor ou igual a 100",
  }),
  data_entrada: z.string().min(1, {
    message: "Data de entrada é obrigatória",
  }),
  data_saida: z.string().optional(),
  consumo_kwh: z.number().optional(),
  possui_geracao_propria: z.boolean().optional(),
  potencia_instalada: z.number().optional(),
  data_inicio_geracao: z.string().optional(),
  observacao_geracao: z.string().optional(),
  recebe_creditos_proprios: z.boolean().optional(),
  uc_origem_creditos: z.string().optional(),
  data_inicio_creditos: z.string().optional(),
  observacao_creditos: z.string().optional(),
  cooperado_id: z.string().min(1, {
    message: "Cooperado é obrigatório",
  }),
  calculo_fatura_template_id: z.string().optional(),
});

export type CooperadoFormValues = z.infer<typeof cooperadoFormSchema>;
export type UnidadeBeneficiariaFormValues = z.infer<typeof unidadeBeneficiariaFormSchema>;
export type UnidadeBeneficiariaFormData = z.infer<typeof UnidadeBeneficiariaSchema>;

export interface SortField {
  id: string;
  desc: boolean;
}

export interface FilterField {
  id: string;
  value: string;
}

export interface TableState {
  sorting: SortField[];
  filtering: FilterField[];
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
}
