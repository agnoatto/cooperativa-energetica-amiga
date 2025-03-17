
/**
 * Consultas para lançamentos financeiros
 * 
 * Este módulo contém funções para buscar lançamentos financeiros do Supabase
 * usando uma abordagem simplificada para evitar problemas com relacionamentos complexos
 * e possíveis restrições de segurança no banco de dados.
 */

import { supabase } from "@/integrations/supabase/client";
import { UseLancamentosFinanceirosOptions } from "./types";
import { LancamentoFinanceiro } from "@/types/financeiro";

export async function fetchLancamentos({
  tipo,
}: UseLancamentosFinanceirosOptions): Promise<LancamentoFinanceiro[]> {
  console.log('Iniciando busca por lançamentos do tipo:', tipo);

  try {
    // Consulta básica e direta sem joins
    const { data, error } = await supabase
      .from('lancamentos_financeiros')
      .select('*')
      .eq('tipo', tipo)
      .is('deleted_at', null);

    if (error) {
      console.error('Erro ao buscar lançamentos:', error.message);
      console.error('Detalhes do erro:', {
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }

    console.log('Lançamentos encontrados:', data?.length || 0);
    
    return data || [];
  } catch (error) {
    console.error('Exceção não tratada ao buscar lançamentos:', error);
    return [];
  }
}
