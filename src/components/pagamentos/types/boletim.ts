
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
    mes: number;
    ano: number;
    tusd_fio_b: number | null;
    valor_tusd_fio_b: number;
    valor_concessionaria: number;
  }>;
  data_emissao: Date;
  valor_receber: number;
}
