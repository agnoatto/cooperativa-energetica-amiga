
/**
 * Consultas para lançamentos financeiros
 * 
 * Este módulo contém funções para buscar lançamentos financeiros do Supabase
 * usando uma abordagem que ignora as políticas RLS problemáticas com funções SECURITY DEFINER.
 * A implementação contorna problemas de recursão infinita nas políticas de segurança.
 */

import { UseLancamentosFinanceirosOptions } from "./types";
import { LancamentoFinanceiro } from "@/types/financeiro";
import { 
  buscarLancamentosViaProcedure, 
  buscarLancamentosViaConsultaDireta 
} from "./repositories/lancamentosRepository";
import { processarLancamento } from "./services/processadores/processadorLancamento";
import { aplicarFiltros } from "./services/filtros/filtrosLancamento";
import { converterHistoricoStatus } from "./core/historicoStatusUtils";

/**
 * Busca lançamentos financeiros com filtros
 * 
 * @param options Opções de consulta (tipo, filtros, etc.)
 * @returns Array de lançamentos financeiros
 */
export async function fetchLancamentos(options: UseLancamentosFinanceirosOptions): Promise<LancamentoFinanceiro[]> {
  try {
    // Tentar buscar via procedimento armazenado
    const { data, error } = await buscarLancamentosViaProcedure(options);

    if (error) {
      console.error('Erro ao buscar lançamentos:', error.message);
      console.error('Detalhes do erro:', {
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }

    console.log('Lançamentos encontrados:', data ? data.length : 0);
    
    // Se não houver dados, retornar array vazio
    if (!data || data.length === 0) {
      return [];
    }
    
    // Processar cada lançamento para adicionar dados relacionados
    const lancamentosProcessados = await Promise.all(
      data.map(item => {
        // Converter o historico_status para o tipo esperado antes de processar
        const itemComHistoricoConvertido = {
          ...item,
          historico_status: converterHistoricoStatus(item.historico_status)
        };
        return processarLancamento({ item: itemComHistoricoConvertido, tipo: options.tipo });
      })
    );
    
    // Aplicar filtros e remover nulos
    return lancamentosProcessados
      .filter(lancamento => lancamento !== null)
      .filter(lancamento => 
        aplicarFiltros(lancamento as LancamentoFinanceiro, options.status, options.busca)
      ) as LancamentoFinanceiro[];
      
  } catch (error) {
    console.error('Exceção não tratada ao buscar lançamentos:', error);
    
    // Tenta um fallback direto caso a função RPC falhe
    try {
      // Buscar lançamentos via consulta direta como fallback
      const { data, error: fallbackError } = await buscarLancamentosViaConsultaDireta(options);
        
      if (fallbackError) {
        console.error('Erro no método alternativo:', fallbackError);
        return [];
      }
      
      // Processar cada lançamento para adicionar dados relacionados
      const lancamentosProcessados = await Promise.all(
        (data || []).map(item => {
          // Converter o historico_status para o tipo esperado antes de processar
          const itemComHistoricoConvertido = {
            ...item,
            historico_status: converterHistoricoStatus(item.historico_status)
          };
          return processarLancamento({ item: itemComHistoricoConvertido, tipo: options.tipo });
        })
      );
      
      // Aplicar filtros e remover nulos
      return lancamentosProcessados
        .filter(lancamento => lancamento !== null)
        .filter(lancamento => 
          aplicarFiltros(lancamento as LancamentoFinanceiro, options.status, options.busca)
        ) as LancamentoFinanceiro[];
        
    } catch (fallbackError) {
      console.error('Também falhou o método alternativo:', fallbackError);
      return [];
    }
  }
}
