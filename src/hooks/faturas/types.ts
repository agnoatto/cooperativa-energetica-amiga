
import { Fatura, FaturaStatus } from "@/types/fatura";

export interface UnidadeBeneficiaria {
  id: string;
  numero_uc: string;
  apelido: string | null;
  data_entrada: string;
  cooperado: {
    nome: string;
  };
}

export interface UpdateFaturaInput {
  id: string;
  consumo_kwh: number;
  total_fatura: number;
  fatura_concessionaria: number;
  iluminacao_publica: number;
  outros_valores: number;
  saldo_energia_kwh: number;
  observacao: string | null;
  data_vencimento: string;
  percentual_desconto: number;
}

export interface UpdateFaturaStatusInput {
  id: string;
  status: FaturaStatus;
  observacao?: string;
  data_pagamento?: string;
  valor_adicional?: number;
  observacao_pagamento?: string;
}

export interface UseFaturasResult {
  faturas: Fatura[] | undefined;
  isLoading: boolean;
  updateFatura: (data: UpdateFaturaInput) => void;
  isUpdating: boolean;
  gerarFaturas: () => void;
  isGenerating: boolean;
  deleteFatura: (id: string) => void;
  updateFaturaStatus: (data: UpdateFaturaStatusInput) => Promise<void>;
}
