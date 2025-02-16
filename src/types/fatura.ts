
export interface Cooperado {
  nome: string;
  documento: string;
}

export interface UnidadeBeneficiaria {
  numero_uc: string;
  apelido: string | null;
  endereco: string;
  percentual_desconto: number;
  cooperado: Cooperado;
}

export type FaturaStatus = 'gerada' | 'pendente' | 'enviada' | 'atrasada' | 'paga' | 'finalizada';

export interface StatusHistoryEntry {
  status: FaturaStatus;
  data: string;
  observacao?: string;
}

export interface Fatura {
  id: string;
  consumo_kwh: number;
  valor_total: number;
  status: FaturaStatus;
  data_vencimento: string;
  mes: number;
  ano: number;
  fatura_concessionaria: number;
  total_fatura: number;
  iluminacao_publica: number;
  outros_valores: number;
  valor_desconto: number;
  economia_acumulada: number;
  saldo_energia_kwh: number;
  observacao: string | null;
  valor_adicional: number;
  observacao_pagamento: string | null;
  data_pagamento: string | null;
  arquivo_concessionaria_path: string | null;
  arquivo_concessionaria_nome: string | null;
  arquivo_concessionaria_tipo: string | null;
  arquivo_concessionaria_tamanho: number | null;
  data_envio?: string | null;
  data_confirmacao_pagamento?: string | null;
  data_criacao?: string;
  data_atualizacao?: string;
  historico_status: StatusHistoryEntry[];
  unidade_beneficiaria: UnidadeBeneficiaria;
}
