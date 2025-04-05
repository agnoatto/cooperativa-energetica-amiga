
export type TipoLancamento = 'receita' | 'despesa';
export type StatusLancamento = 'pendente' | 'pago' | 'atrasado' | 'cancelado';

export interface HistoricoStatus {
  data: string;
  status_anterior: StatusLancamento;
  novo_status: StatusLancamento;
  valor_pago?: number;
  valor_juros?: number;
  valor_desconto?: number;
  observacao?: string;
}

export interface LancamentoFinanceiro {
  id: string;
  tipo: TipoLancamento;
  status: StatusLancamento;
  descricao: string;
  valor: number;
  valor_original: number;
  valor_pago?: number | null;
  valor_juros?: number;
  valor_desconto?: number;
  data_vencimento: string;
  data_pagamento?: string | null;
  observacao?: string;
  cooperado_id?: string;
  investidor_id?: string;
  fatura_id?: string;
  pagamento_usina_id?: string;
  conta_bancaria_id?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  historico_status: HistoricoStatus[];
  comprovante_path?: string;
  comprovante_nome?: string;
  comprovante_tipo?: string;
  cooperado?: {
    nome: string;
    documento: string;
    telefone?: string | null;
    email?: string | null;
    numero_cadastro?: string | null;
  };
  investidor?: {
    nome_investidor: string;
    documento: string;
    telefone?: string | null;
    email?: string | null;
  };
  fatura?: {
    id?: string;
    numero_fatura: string;
    mes?: number;
    ano?: number;
    data_vencimento: string;
    unidade_beneficiaria: {
      numero_uc: string;
      apelido?: string | null;
      endereco?: string;
    };
  };
  pagamento_usina?: {
    id?: string;
    mes?: number;
    ano?: number;
    geracao_kwh?: number;
    valor_total?: number;
    status?: string;
    data_vencimento?: string;
    data_pagamento?: string;
    usina?: {
      unidade_usina?: {
        numero_uc: string;
        apelido?: string | null;
      } | null;
    } | null;
  };
}

export interface MetricaFinanceira {
  mes: string;
  tipo: TipoLancamento;
  status: StatusLancamento;
  quantidade: number;
  valor_total: number;
}
