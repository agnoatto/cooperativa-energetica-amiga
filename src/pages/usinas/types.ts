
export interface UsinaData {
  id: string;
  valor_kwh: number;
  status: string;
  potencia_instalada?: number;
  data_inicio?: string;
  investidor?: {
    nome_investidor: string;
  };
  unidade?: {
    numero_uc: string;
  };
}
