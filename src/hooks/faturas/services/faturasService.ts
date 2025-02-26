
import { supabase } from "@/integrations/supabase/client";
import { FaturaStatus } from "@/types/fatura";
import { UnidadeBeneficiaria } from "@/hooks/faturas/types";
import { Database } from "@/integrations/supabase/types";

type FaturaInsert = Database["public"]["Tables"]["faturas"]["Insert"];

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
  status: Database["public"]["Enums"]["fatura_status"];
}

export const faturasService = {
  async buscarUnidadesElegiveis(dataLimite: string): Promise<UnidadeBeneficiaria[]> {
    const { data, error } = await supabase
      .from('unidades_beneficiarias')
      .select(`
        id,
        numero_uc,
        apelido,
        data_entrada,
        cooperado:cooperado_id (
          nome
        )
      `)
      .lte('data_entrada', dataLimite)
      .is('data_saida', null);

    if (error) throw error;
    return data || [];
  },

  async verificarFaturaExistente(unidadeId: string, mes: number, ano: number) {
    const { data, error } = await supabase
      .from('faturas')
      .select('id')
      .eq('unidade_beneficiaria_id', unidadeId)
      .eq('mes', mes)
      .eq('ano', ano);

    if (error) throw error;
    return data;
  },

  async inserirFatura(fatura: NovaFatura) {
    const faturaInsert: FaturaInsert = {
      mes: fatura.mes,
      ano: fatura.ano,
      consumo_kwh: fatura.consumo_kwh,
      valor_assinatura: fatura.valor_assinatura,
      total_fatura: fatura.total_fatura,
      fatura_concessionaria: fatura.fatura_concessionaria,
      iluminacao_publica: fatura.iluminacao_publica,
      outros_valores: fatura.outros_valores,
      valor_desconto: fatura.valor_desconto,
      economia_acumulada: fatura.economia_acumulada,
      saldo_energia_kwh: fatura.saldo_energia_kwh,
      data_vencimento: fatura.data_vencimento,
      unidade_beneficiaria_id: fatura.unidade_beneficiaria_id,
      status: fatura.status
    };

    const { data, error } = await supabase
      .from('faturas')
      .insert(faturaInsert)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async gerarFaturas(faturas: NovaFatura[]) {
    const faturasInsert: FaturaInsert[] = faturas.map(fatura => ({
      mes: fatura.mes,
      ano: fatura.ano,
      consumo_kwh: fatura.consumo_kwh,
      valor_assinatura: fatura.valor_assinatura,
      total_fatura: fatura.total_fatura,
      fatura_concessionaria: fatura.fatura_concessionaria,
      iluminacao_publica: fatura.iluminacao_publica,
      outros_valores: fatura.outros_valores,
      valor_desconto: fatura.valor_desconto,
      economia_acumulada: fatura.economia_acumulada,
      saldo_energia_kwh: fatura.saldo_energia_kwh,
      data_vencimento: fatura.data_vencimento,
      unidade_beneficiaria_id: fatura.unidade_beneficiaria_id,
      status: fatura.status
    }));

    const { error } = await supabase
      .from('faturas')
      .insert(faturasInsert);

    if (error) throw error;
  }
};
