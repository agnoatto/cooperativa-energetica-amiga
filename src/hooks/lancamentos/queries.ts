
/**
 * Consultas para lançamentos financeiros
 * 
 * Este módulo contém funções para buscar lançamentos financeiros do Supabase
 * usando uma abordagem simplificada para evitar problemas com relacionamentos complexos
 * e possíveis restrições de segurança no banco de dados.
 */

import { supabase } from "@/integrations/supabase/client";
import { UseLancamentosFinanceirosOptions } from "./types";
import { LancamentoFinanceiro, HistoricoStatus } from "@/types/financeiro";

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
    
    // Converter e garantir que o historico_status seja um array de HistoricoStatus
    return (data || []).map(item => {
      // Converter o campo historico_status para garantir a compatibilidade com o tipo HistoricoStatus[]
      let historicoStatus: HistoricoStatus[] = [];
      
      // Verificar se historico_status existe e é um array
      if (item.historico_status && Array.isArray(item.historico_status)) {
        historicoStatus = item.historico_status.map((hist: any) => ({
          data: hist.data || '',
          status_anterior: hist.status_anterior || 'pendente',
          novo_status: hist.novo_status || 'pendente'
        }));
      } else if (item.historico_status) {
        // Caso seja um objeto JSON ou string, tentar converter
        try {
          const parsedHistorico = typeof item.historico_status === 'string' 
            ? JSON.parse(item.historico_status) 
            : item.historico_status;
          
          if (Array.isArray(parsedHistorico)) {
            historicoStatus = parsedHistorico.map((hist: any) => ({
              data: hist.data || '',
              status_anterior: hist.status_anterior || 'pendente',
              novo_status: hist.novo_status || 'pendente'
            }));
          }
        } catch (e) {
          console.error('Erro ao converter historico_status:', e);
        }
      }
      
      // Retornar lançamento com o historico_status devidamente tipado
      return {
        ...item,
        historico_status: historicoStatus
      } as LancamentoFinanceiro;
    });
  } catch (error) {
    console.error('Exceção não tratada ao buscar lançamentos:', error);
    return [];
  }
}
