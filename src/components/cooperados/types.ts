
import { z } from "zod";

export const cooperadoFormSchema = z.object({
  nome: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  documento: z.string().min(11, { message: "Documento deve ter pelo menos 11 caracteres" }),
  tipo_pessoa: z.enum(["fisica", "juridica"]),
  telefone: z.string().min(10, { message: "Telefone deve ter pelo menos 10 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  responsavel_nome: z.string().optional(),
  responsavel_cpf: z.string().optional(),
  responsavel_telefone: z.string().optional(),
  numero_cadastro: z.string().optional(),
});

// Template de cálculo de fatura é opcional (pode ser null)
export const unidadeBeneficiariaFormSchema = z.object({
  numero_uc: z.string().min(1, { message: "Número da UC é obrigatório" }),
  apelido: z.string().optional(),
  cep: z.string().min(1, { message: "CEP é obrigatório" }),
  logradouro: z.string().min(1, { message: "Logradouro é obrigatório" }),
  numero: z.string().min(1, { message: "Número é obrigatório" }),
  complemento: z.string().optional(),
  bairro: z.string().min(1, { message: "Bairro é obrigatório" }),
  cidade: z.string().min(1, { message: "Cidade é obrigatória" }),
  uf: z.string().min(1, { message: "UF é obrigatória" }),
  percentual_desconto: z.number().min(0, { message: "Desconto deve ser maior ou igual a 0" }),
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
  calculo_fatura_template_id: z.string().optional()
});

export interface UnidadeBeneficiariaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cooperadoId?: string;
  unidadeId?: string;
  onSuccess?: () => void;
}

export interface UnidadesTableProps {
  unidades: any[];
  onEdit: (cooperadoId: string, unidadeId: string) => void;
  onDelete: (unidadeId: string, motivo?: string) => void;
  onReativar?: (unidadeId: string) => void;
  showCooperadoInfo?: boolean;
}
