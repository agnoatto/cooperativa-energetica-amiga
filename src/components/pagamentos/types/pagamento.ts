
export type PagamentoStatus = 'pendente' | 'confirmado' | 'atrasado' | 'cancelado';

export interface PagamentoFormValues {
  usina_id: string;
  mes: number;
  ano: number;
  geracao_kwh: number;
  tusd_fio_b: number;
  valor_tusd_fio_b: number;
  valor_concessionaria: number;
  valor_total: number;
  data_emissao: string;
  data_vencimento: string;
  data_vencimento_concessionaria: string;
  data_pagamento: string | null;
  status: PagamentoStatus;
  observacao: string | null;
  observacao_pagamento: string | null;
  arquivo_conta_energia_nome: string | null;
  arquivo_conta_energia_path: string | null;
  arquivo_conta_energia_tipo: string | null;
  arquivo_conta_energia_tamanho: number | null;
}

export interface PagamentoData extends PagamentoFormValues {
  id: string;
  created_at: string;
  updated_at: string;
  empresa_id: string | null;
  historico_status: {
    data: string;
    status: PagamentoStatus;
  }[];
  usina: {
    valor_kwh: number;
    investidor: {
      nome_investidor: string;
    };
    unidade_usina: {
      numero_uc: string;
    };
  };
}
