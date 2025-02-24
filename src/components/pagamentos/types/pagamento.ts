
export type PagamentoStatus = 'pendente' | 'enviado' | 'pago' | 'atrasado' | 'cancelado';
export type SendMethod = 'email' | 'whatsapp' | null;

export interface HistoricoStatus {
  data: string;
  status_anterior: PagamentoStatus;
  novo_status: PagamentoStatus;
}

export interface PagamentoFormValues {
  usina_id: string;
  mes: number;
  ano: number;
  geracao_kwh: number;
  tusd_fio_b: number;
  valor_tusd_fio_b: number;
  valor_concessionaria: number;
  valor_total: number;
  data_emissao: string | null;
  data_vencimento: string;
  data_vencimento_concessionaria: string | null;
  data_pagamento: string | null;
  data_envio: string | null;
  status: PagamentoStatus;
  observacao: string | null;
  observacao_pagamento: string | null;
  arquivo_conta_energia_nome: string | null;
  arquivo_conta_energia_path: string | null;
  arquivo_conta_energia_tipo: string | null;
  arquivo_conta_energia_tamanho: number | null;
  send_method: SendMethod;
}

export interface PagamentoData extends PagamentoFormValues {
  id: string;
  created_at: string;
  updated_at: string;
  empresa_id: string | null;
  historico_status: HistoricoStatus[];
  geracao_kwh: number;
  usina: {
    id: string;
    valor_kwh: number;
    investidor: {
      nome_investidor: string;
    };
    unidade_usina: {
      numero_uc: string;
    };
  };
}
