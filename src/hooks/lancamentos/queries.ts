
/**
 * Consultas para lançamentos financeiros
 * 
 * Este módulo contém funções para buscar lançamentos financeiros do Supabase
 * usando uma abordagem que ignora as políticas RLS problemáticas com funções SECURITY DEFINER.
 * A implementação contorna problemas de recursão infinita nas políticas de segurança.
 */

import { supabase } from "@/integrations/supabase/client";
import { UseLancamentosFinanceirosOptions } from "./types";
import { LancamentoFinanceiro, HistoricoStatus } from "@/types/financeiro";

export async function fetchLancamentos({
  tipo,
}: UseLancamentosFinanceirosOptions): Promise<LancamentoFinanceiro[]> {
  console.log('Iniciando busca por lançamentos do tipo:', tipo);

  try {
    // Usar uma função RPC definida no Supabase que ignora as políticas RLS
    // Essa função deverá ser criada no backend com SECURITY DEFINER
    const { data, error } = await supabase
      .rpc('get_lancamentos_by_tipo', { p_tipo: tipo });

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
    
    // Se não houver dados, retornar array vazio
    if (!data || data.length === 0) {
      return [];
    }
    
    // Converter e garantir que o historico_status seja um array de HistoricoStatus
    return data.map(item => {
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
    
    // Tenta um fallback direto caso a função RPC falhe
    try {
      console.log('Tentando método alternativo de busca...');
      
      // Consulta direta mais simples
      const { data, error: fallbackError } = await supabase
        .from('lancamentos_financeiros')
        .select('*')
        .eq('tipo', tipo)
        .is('deleted_at', null);
        
      if (fallbackError) {
        console.error('Erro no método alternativo:', fallbackError);
        return [];
      }
      
      return (data || []).map(item => {
        // Processamento de historico_status igual ao anterior
        let historicoStatus: HistoricoStatus[] = [];
        
        if (item.historico_status) {
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
            console.error('Erro ao converter historico_status no fallback:', e);
          }
        }
        
        return {
          ...item,
          historico_status: historicoStatus
        } as LancamentoFinanceiro;
      });
    } catch (fallbackError) {
      console.error('Também falhou o método alternativo:', fallbackError);
      return [];
    }
  }
}
