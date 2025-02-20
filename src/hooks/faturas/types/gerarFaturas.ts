
import { FaturaStatus } from "@/types/fatura";

export interface NovaFatura {
  unidade_beneficiaria_id: string;
  mes: number;
  ano: number;
  consumo_kwh: number;
  total_fatura: number;
  status: FaturaStatus;
  data_vencimento: string;
  economia_acumulada: number;
  economia_mes: number;
  saldo_energia_kwh: number;
  fatura_concessionaria: number;
  iluminacao_publica: number;
  outros_valores: number;
  valor_desconto: number;
  valor_assinatura: number;
  historico_status: any[];
  data_criacao: string;
  data_atualizacao: string;
}

export interface ResultadoGeracaoFaturas {
  faturasGeradas: number;
  erros: number;
  logErros: string[];
  message: string;
}
