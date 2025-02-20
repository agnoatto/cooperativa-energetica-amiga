
import { supabase } from "@/integrations/supabase/client";
import { NovaFatura } from "../types/gerarFaturas";
import { UnidadeBeneficiaria } from "../types";

export const buscarUnidadesElegiveis = async (ultimoDiaMes: string) => {
  const { data: unidades, error } = await supabase
    .from("unidades_beneficiarias")
    .select(`
      id,
      numero_uc,
      apelido,
      data_entrada,
      percentual_desconto,
      cooperado:cooperado_id (
        id,
        nome
      )
    `)
    .filter('data_saida', 'is', null)
    .lte('data_entrada', ultimoDiaMes);

  if (error) {
    throw new Error(`Erro ao buscar unidades beneficiárias: ${error.message}`);
  }

  return unidades as UnidadeBeneficiaria[];
};

export const verificarFaturaExistente = async (
  unidade_id: string,
  mes: number,
  ano: number
) => {
  const { data: faturas, error } = await supabase
    .from("faturas")
    .select('id')
    .eq("unidade_beneficiaria_id", unidade_id)
    .eq("mes", mes)
    .eq("ano", ano);

  if (error) {
    throw new Error(`Erro ao verificar fatura existente: ${error.message}`);
  }

  return faturas;
};

export const inserirFatura = async (novaFatura: NovaFatura) => {
  const { data: faturaInserida, error } = await supabase
    .from("faturas")
    .insert(novaFatura)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(`Erro ao inserir fatura: ${error.message}`);
  }

  return faturaInserida;
};
