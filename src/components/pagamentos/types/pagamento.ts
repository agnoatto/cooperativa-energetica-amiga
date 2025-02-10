
export interface PagamentoData {
  id: string;
  geracao_kwh: number;
  valor_total: number;
  status: string;
  data_pagamento: string | null;
  tusd_fio_b: number | null;
  valor_tusd_fio_b: number | null;
  valor_concessionaria: number;
  usina: {
    valor_kwh: number;
  };
}

export interface PagamentoFormValues {
  geracao_kwh: number;
  valor_total: number;
  status: string;
  data_pagamento: string | null;
  tusd_fio_b: number;
  valor_concessionaria: number;
}
