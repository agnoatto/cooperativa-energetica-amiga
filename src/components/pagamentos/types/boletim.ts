
import { PagamentoData } from "./pagamento";

export interface BoletimMedicaoData {
  usina: {
    nome_investidor: string;
    numero_uc: string;
    concessionaria: string;
    modalidade: string;
    valor_kwh: number;
  };
  pagamentos: PagamentoData[];
  data_emissao: Date;
  valor_receber: number;
}
