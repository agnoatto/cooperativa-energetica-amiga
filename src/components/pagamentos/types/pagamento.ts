
export type PagamentoStatus = 'pendente' | 'enviado' | 'confirmado' | 'atrasado' | 'pago' | 'cancelado';

export interface PagamentoData {
  id: string;
  geracao_kwh: number;
  valor_total: number;
  status: PagamentoStatus;
  data_pagamento: string | null;
  data_emissao: string | null;
  data_vencimento: string;
  data_confirmacao: string | null;
  data_envio: string | null;
  tusd_fio_b: number | null;
  valor_tusd_fio_b: number | null;
  valor_concessionaria: number;
  data_vencimento_concessionaria: string | null;
  mes: number;
  ano: number;
  arquivo_comprovante_nome: string | null;
  arquivo_comprovante_path: string | null;
  arquivo_comprovante_tipo: string | null;
  arquivo_comprovante_tamanho: number | null;
  observacao: string | null;
  observacao_pagamento: string | null;
  historico_status: Array<{
    data: string;
    status_anterior: PagamentoStatus;
    novo_status: PagamentoStatus;
  }>;
  send_method: string[] | null;
  empresa_id: string | null;
  usina: {
    id: string;
    valor_kwh: number;
    unidade_usina: {
      numero_uc: string;
    };
    investidor: {
      nome_investidor: string;
    };
  };
}

export interface PagamentoFormValues {
  geracao_kwh: number;
  valor_total: number;
  status: PagamentoStatus;
  data_pagamento: string | null;
  data_emissao: string | null;
  tusd_fio_b: number;
  valor_concessionaria: number;
  data_vencimento_concessionaria: string | null;
  observacao?: string;
  observacao_pagamento?: string;
  arquivo_comprovante_nome: string | null;
  arquivo_comprovante_path: string | null;
}
