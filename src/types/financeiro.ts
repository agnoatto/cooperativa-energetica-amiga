
export type TipoLancamento = 'receita' | 'despesa';
export type StatusLancamento = 'pendente' | 'pago' | 'atrasado' | 'cancelado';

export interface HistoricoStatus {
  data: string;
  status_anterior: StatusLancamento;
  novo_status: StatusLancamento;
}

export interface LancamentoFinanceiro {
  id: string;
  tipo: TipoLancamento;
  status: StatusLancamento;
  descricao: string;
  valor: number;
  data_vencimento: string;
  data_pagamento?: string;
  observacao?: string;
  cooperado_id?: string;
  investidor_id?: string;
  fatura_id?: string;
  pagamento_usina_id?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  historico_status: HistoricoStatus[];
  comprovante_path?: string;
  comprovante_nome?: string;
  comprovante_tipo?: string;
  cooperado?: {
    nome: string;
    documento: string;
  };
  investidor?: {
    nome_investidor: string;
    documento: string;
  };
  fatura?: {
    numero_fatura: string;
    unidade_beneficiaria: {
      numero_uc: string;
    };
  };
  pagamento_usina?: {
    usina: {
      unidade_usina: {
        numero_uc: string;
      };
    };
  };
}

export interface MetricaFinanceira {
  mes: string;
  tipo: TipoLancamento;
  status: StatusLancamento;
  quantidade: number;
  valor_total: number;
}
