
export interface UsinaData {
  id: string;
  valor_kwh: number;
  investidor?: {
    nome_investidor: string;
  };
  unidade?: {
    numero_uc: string;
  };
}
