
export interface UnidadeBeneficiaria {
  id: string;
  numero_uc: string;
  apelido: string | null;
  cooperado: {
    nome: string;
  };
}

export interface Fatura {
  id: string;
  consumo_kwh: number;
  valor_total: number;
  status: string;
  data_vencimento: string;
  mes: number;
  ano: number;
  fatura_concessionaria: number;
  total_fatura: number;
  iluminacao_publica: number;
  outros_valores: number;
  valor_desconto: number;
  unidade_beneficiaria: {
    numero_uc: string;
    apelido: string | null;
    endereco: string;
    percentual_desconto: number;
    cooperado: {
      nome: string;
      documento: string;
    };
  };
}
