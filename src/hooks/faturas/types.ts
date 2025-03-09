
import { Fatura, FaturaStatus } from "@/types/fatura";

export interface UpdateFaturaStatusInput {
  id: string;
  status: FaturaStatus;
  observacao?: string;
  observacao_pagamento?: string | null;
  data_pagamento?: string | null;
  valor_adicional?: number | null;
}

export interface UseFaturasResult {
  faturas: Fatura[] | undefined;
  isLoading: boolean;
  isGenerating: boolean;
  gerarFaturas: () => void;
  deleteFatura: (id: string) => void;
  updateFaturaStatus: (data: UpdateFaturaStatusInput) => Promise<void>;
  updateFatura: (data: any) => Promise<Fatura>;
  refetch: () => void; // Adicionando a função de refetch
}

// Adicionando a definição de UnidadeBeneficiaria para resolver os erros de importação
export interface UnidadeBeneficiaria {
  id: string;
  numero_uc: string;
  apelido: string | null;
  data_entrada: string;
  cooperado: {
    nome: string;
  };
}
