
export interface BoletimData {
  usina: {
    nome_investidor: string;
    numero_uc: string;
    valor_kwh: number;
  };
  pagamentos: Array<{
    geracao_kwh: number;
    valor_total: number;
    data_vencimento: string;
    data_emissao: string | null;
    mes: number;
    ano: number;
    valor_tusd_fio_b: number;
    valor_concessionaria: number;
  }>;
  data_emissao: Date;
  data_vencimento: string;
  valor_receber: number;
}
