
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
  economia_acumulada: number;
  saldo_energia_kwh: number;
  observacao: string | null;
  arquivo_concessionaria_path?: string | null;
  arquivo_concessionaria_nome?: string | null;
  unidade_beneficiaria: UnidadeBeneficiaria;
}

