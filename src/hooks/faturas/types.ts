
import { Fatura, FaturaStatus } from "@/types/fatura";
import { UpdateFaturaInput } from "./useUpdateFatura";

export interface UnidadeBeneficiaria {
  id: string;
  numero_uc: string;
  apelido: string | null;
  data_entrada: string;
  cooperado: {
    nome: string;
  };
}

export interface UpdateFaturaStatusInput {
  id: string;
  status: FaturaStatus;
  observacao?: string;
  motivo_correcao?: string;
  campos_alterados?: string[];
  data_pagamento?: string;
  valor_adicional?: number;
  observacao_pagamento?: string;
}

export interface UseFaturasResult {
  faturas: Fatura[] | undefined;
  isLoading: boolean;
  isGenerating: boolean;
  gerarFaturas: () => void;
  deleteFatura: (id: string) => void;
  updateFaturaStatus: (data: UpdateFaturaStatusInput) => Promise<void>;
  updateFatura: (data: UpdateFaturaInput) => Promise<Fatura>; // Alterado para retornar a fatura
}
