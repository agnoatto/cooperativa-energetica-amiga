
import { Database } from "@/integrations/supabase/types";

export interface NovaFatura {
  unidade_beneficiaria_id: string;
  mes: number;
  ano: number;
  consumo_kwh: number;
  total_fatura: number;
  status: Database["public"]["Enums"]["fatura_status"];
  data_vencimento: string;
  economia_acumulada: number;
  economia_mes: number;
  saldo_energia_kwh: number;
  fatura_concessionaria: number;
  iluminacao_publica: number;
  outros_valores: number;
  valor_desconto: number;
  valor_assinatura: number;
  historico_status: {
    status: Database["public"]["Enums"]["fatura_status"];
    data: string;
    observacao?: string;
  }[];
  data_criacao: string;
  data_atualizacao: string;
}

export interface ResultadoGeracaoFaturas {
  faturasGeradas: number;
  erros: number;
  logErros: string[];
  message: string;
}
