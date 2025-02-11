
export interface PagamentoData {
  id: string;
  geracao_kwh: number;
  valor_total: number;
  status: string;
  data_pagamento: string | null;
  data_emissao: string | null;
  data_vencimento: string;
  tusd_fio_b: number | null;
  valor_tusd_fio_b: number | null;
  valor_concessionaria: number;
  mes: number;
  ano: number;
  conta_energia: number;
  usina: {
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
  status: string;
  data_pagamento: string | null;
  data_emissao: string | null;
  tusd_fio_b: number;
  valor_concessionaria: number;
}
