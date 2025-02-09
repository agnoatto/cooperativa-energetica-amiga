
export interface FormState {
  consumo: number;
  totalFatura: string;
  faturaConcessionaria: string;
  iluminacaoPublica: string;
  outrosValores: string;
  saldoEnergiaKwh: number;
  observacao: string;
  dataVencimento: string;
}

export interface FaturaFormProps {
  formState: FormState;
  setFormState: (state: FormState | ((prev: FormState) => FormState)) => void;
  isSubmitting: boolean;
}

export interface FaturaFormFieldProps {
  value: string | number;
  onChange: (value: any) => void;
  isSubmitting: boolean;
}
