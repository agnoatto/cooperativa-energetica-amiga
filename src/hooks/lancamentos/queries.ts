
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

/**
 * Busca lançamentos financeiros com filtros
 * 
 * @param options Opções de consulta (tipo, filtros, etc.)
 * @returns Array de lançamentos financeiros
 */
export async function fetchLancamentos(options: UseLancamentosFinanceirosOptions): Promise<LancamentoFinanceiro[]> {
  try {
    // Devido ao erro com user_roles, vamos usar diretamente a consulta mais simples
    // para evitar recursão infinita nas políticas de segurança
    console.log('Usando método de consulta direta para evitar problemas de recursão...');
    const { data, error } = await buscarLancamentosViaConsultaDireta(options);

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
      data.map(item => processarLancamento({ item, tipo: options.tipo }))
    );
    
    // Aplicar filtros e remover nulos
    return lancamentosProcessados
      .filter(lancamento => lancamento !== null)
      .filter(lancamento => 
        aplicarFiltros(lancamento as LancamentoFinanceiro, options.status, options.busca)
      ) as LancamentoFinanceiro[];
      
  } catch (error) {
    console.error('Exceção não tratada ao buscar lançamentos:', error);
    // Em caso de outro erro, tente uma consulta ainda mais simples
    try {
      console.error('Tentando método de fallback simplificado...');
      const { data } = await supabase
        .from('lancamentos_financeiros')
        .select('*')
        .eq('tipo', options.tipo)
        .is('deleted_at', null);
      
      return (data || []) as LancamentoFinanceiro[];
        
    } catch (fallbackError) {
      console.error('Também falhou o método alternativo:', fallbackError);
      return [];
    }
  }
}

// Importar o supabase aqui para o fallback
import { supabase } from "@/integrations/supabase/client";
