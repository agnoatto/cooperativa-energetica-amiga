
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
  
  try {
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
  } catch (error) {
    console.error('Erro ao executar RPC get_lancamentos_by_tipo:', error);
    // Em caso de erro, vamos tentar uma consulta mais simples que evite o problema de recursão
    return await buscarLancamentosViaConsultaDireta(options);
  }
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
    .select(`
      *,
      fatura:fatura_id (
        id,
        unidade_beneficiaria:unidade_beneficiaria_id (
          numero_uc,
          apelido
        )
      ),
      cooperado:cooperado_id (
        nome,
        documento,
        telefone,
        email
      )
    `)
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
  
  // Aplicar filtro de status se não for 'todos'
  if (options.status !== 'todos') {
    query = query.eq('status', options.status);
  }
  
  // Se houver busca, aplicar filtro nos campos relevantes
  if (options.busca && options.busca.trim() !== '') {
    query = query.or(`
      descricao.ilike.%${options.busca}%,
      fatura.unidade_beneficiaria.numero_uc.ilike.%${options.busca}%,
      fatura.unidade_beneficiaria.apelido.ilike.%${options.busca}%,
      cooperado.nome.ilike.%${options.busca}%
    `);
  }
  
  return await query;
}
