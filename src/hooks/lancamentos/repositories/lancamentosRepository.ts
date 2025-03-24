
/**
 * Repositório de lançamentos financeiros
 * 
 * Este arquivo contém funções para buscar lançamentos financeiros
 * diretamente do banco de dados via Supabase
 */

import { supabase } from "@/integrations/supabase/client";
import { UseLancamentosFinanceirosOptions } from "../types";

/**
 * Executa a consulta principal de lançamentos financeiros via RPC
 * 
 * @param options Opções de consulta (tipo, filtros, etc.)
 * @returns Resultados da consulta
 */
export async function buscarLancamentosViaProcedure(options: UseLancamentosFinanceirosOptions) {
  console.log('Iniciando busca por lançamentos do tipo:', options.tipo);
  console.log('Filtros aplicados:', { 
    status: options.status, 
    busca: options.busca, 
    dataInicio: options.dataInicio, 
    dataFim: options.dataFim 
  });
  
  // Chamar a função RPC para buscar lançamentos
  let query = supabase.rpc('get_lancamentos_by_tipo', { p_tipo: options.tipo });
  
  // Aplicar filtros de data diretamente na query se estiverem disponíveis
  if (options.dataInicio) {
    const dataInicioFormatada = new Date(options.dataInicio).toISOString();
    query = query.gte('data_vencimento', dataInicioFormatada);
  }
  
  if (options.dataFim) {
    const dataFimFormatada = new Date(options.dataFim).toISOString();
    query = query.lte('data_vencimento', dataFimFormatada);
  }
  
  return await query;
}

/**
 * Executa uma consulta direta à tabela de lançamentos (fallback)
 * 
 * @param options Opções de consulta (tipo, filtros, etc.)
 * @returns Resultados da consulta
 */
export async function buscarLancamentosViaConsultaDireta(options: UseLancamentosFinanceirosOptions) {
  console.log('Tentando método alternativo de busca...');
  
  // Consulta direta mais simples evitando joins complexos
  let query = supabase
    .from('lancamentos_financeiros')
    .select('*')
    .eq('tipo', options.tipo)
    .is('deleted_at', null);
    
  // Aplicar filtros de data diretamente na query
  if (options.dataInicio) {
    const dataInicioFormatada = new Date(options.dataInicio).toISOString();
    query = query.gte('data_vencimento', dataInicioFormatada);
  }
  
  if (options.dataFim) {
    const dataFimFormatada = new Date(options.dataFim).toISOString();
    query = query.lte('data_vencimento', dataFimFormatada);
  }
  
  return await query;
}
