
import { supabase } from "@/integrations/supabase/client";
import { FaturaStatus } from "@/types/fatura";

export interface NovaFatura {
  mes: number;
  ano: number;
  consumo_kwh: number;
  valor_assinatura: number;
  total_fatura: number;
  fatura_concessionaria: number;
  iluminacao_publica: number;
  outros_valores: number;
  valor_desconto: number;
  economia_acumulada: number;
  saldo_energia_kwh: number;
  data_vencimento: string;
  unidade_beneficiaria_id: string;
  status: FaturaStatus;
  historico_status: {
    status: FaturaStatus;
    data: string;
    observacao?: string;
  }[];
}

export const faturasService = {
  async gerarFaturas(faturas: NovaFatura[]) {
    const { error } = await supabase.from("faturas").insert(faturas);
    if (error) throw error;
  }
};
