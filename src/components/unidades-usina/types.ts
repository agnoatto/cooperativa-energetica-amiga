
import { UseFormReturn } from "react-hook-form";

const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", 
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
] as const;

export type UF = typeof UFS[number];

export interface UnidadeUsinaFormValues {
  numero_uc: string;
  titular_id: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: UF;
}

export interface AddressFieldsProps {
  form: UseFormReturn<UnidadeUsinaFormValues>;
  isLoadingCep: boolean;
  onFetchCep: (cep: string) => Promise<void>;
}

export interface BasicInfoFieldsProps {
  form: UseFormReturn<UnidadeUsinaFormValues>;
  investidores?: any[];
}

export interface ViaCEPResponse {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}
