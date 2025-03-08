
import { z } from "zod";
import { cooperadoFormSchema } from "./schema";
import { UseFormReturn } from "react-hook-form";

export type CooperadoFormValues = z.infer<typeof cooperadoFormSchema>;

const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", 
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
] as const;

export type UF = typeof UFS[number];

export interface UnidadeBeneficiariaFormValues {
  numero_uc: string;
  apelido?: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: UF;
  percentual_desconto: string;
  data_entrada: string;
  data_saida?: string;
  consumo_kwh: string;
  possui_geracao_propria: boolean;
  potencia_instalada?: number | null;
  data_inicio_geracao?: string | null;
  observacao_geracao?: string | null;
  recebe_creditos_proprios: boolean;
  uc_origem_creditos?: string | null;
  data_inicio_creditos?: string | null;
  observacao_creditos?: string | null;
  calculo_fatura_template_id?: string;
}

export interface AddressFieldsProps {
  form: UseFormReturn<UnidadeBeneficiariaFormValues>;
  isLoadingCep: boolean;
  onFetchCep: (cep: string) => Promise<void>;
}

export interface BasicInfoFieldsProps {
  form: UseFormReturn<UnidadeBeneficiariaFormValues>;
}

export interface DateFieldsProps {
  form: UseFormReturn<UnidadeBeneficiariaFormValues>;
}

export interface UnidadeBeneficiariaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cooperadoId: string;
  unidadeId?: string;
  onSuccess?: () => void;
}

export interface ViaCEPResponse {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}
