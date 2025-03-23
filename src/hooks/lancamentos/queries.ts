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

/**
 * Busca lançamentos financeiros com filtros
 * 
 * @param tipo Tipo do lançamento (receita ou despesa)
 * @param status Status do lançamento (opcional)
 * @param busca Texto para busca (opcional)
 * @param dataInicio Data inicial para filtro (opcional)
 * @param dataFim Data final para filtro (opcional)
 * @returns Array de lançamentos financeiros
 */
export async function fetchLancamentos({
  tipo,
  status,
  busca,
  dataInicio,
  dataFim
}: UseLancamentosFinanceirosOptions): Promise<LancamentoFinanceiro[]> {
  console.log('Iniciando busca por lançamentos do tipo:', tipo);
  console.log('Filtros aplicados:', { status, busca, dataInicio, dataFim });

  try {
    // Chamar a função RPC para buscar lançamentos
    let query = supabase.rpc('get_lancamentos_by_tipo', { p_tipo: tipo });
    
    // Aplicar filtros de data diretamente na query se estiverem disponíveis
    if (dataInicio) {
      const dataInicioFormatada = new Date(dataInicio).toISOString();
      query = query.gte('data_vencimento', dataInicioFormatada);
    }
    
    if (dataFim) {
      const dataFimFormatada = new Date(dataFim).toISOString();
      query = query.lte('data_vencimento', dataFimFormatada);
    }
    
    const { data, error } = await query;

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
    
    // Buscar informações adicionais para cada lançamento
    const lancamentosEnriquecidos = await Promise.all(data.map(async (item) => {
      // Converter o campo historico_status
      let historicoStatus: HistoricoStatus[] = [];
      
      if (item.historico_status && Array.isArray(item.historico_status)) {
        historicoStatus = item.historico_status.map((hist: any) => ({
          data: hist.data || '',
          status_anterior: hist.status_anterior || 'pendente',
          novo_status: hist.novo_status || 'pendente'
        }));
      } else if (item.historico_status) {
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
      
      // Objeto base para o lançamento
      const lancamento: Partial<LancamentoFinanceiro> = {
        ...item,
        historico_status: historicoStatus,
        cooperado: null,
        investidor: null,
        fatura: null,
        pagamento_usina: null
      };
      
      // Buscar informações adicionais conforme o tipo de lançamento
      try {
        // Se for receita, buscar mais detalhes do cooperado
        if (item.tipo === 'receita' && item.cooperado_id) {
          const { data: cooperadoData } = await supabase
            .from('cooperados')
            .select('nome, documento, telefone, email, numero_cadastro')
            .eq('id', item.cooperado_id)
            .single();
            
          if (cooperadoData) {
            lancamento.cooperado = cooperadoData;
          }
          
          // Se tiver fatura, buscar detalhes da fatura separadamente
          if (item.fatura_id) {
            const { data: faturaData } = await supabase
              .from('faturas')
              .select(`
                id,
                mes, 
                ano,
                unidade_beneficiaria_id,
                data_vencimento
              `)
              .eq('id', item.fatura_id)
              .single();
              
            if (faturaData) {
              // Agora buscar a unidade beneficiária separadamente
              const { data: unidadeData } = await supabase
                .from('unidades_beneficiarias')
                .select('numero_uc, apelido, endereco')
                .eq('id', faturaData.unidade_beneficiaria_id)
                .single();
              
              // Formatar número da fatura (usando mes/ano como referência)
              const numeroFatura = faturaData.mes && faturaData.ano 
                ? `${faturaData.mes.toString().padStart(2, '0')}/${faturaData.ano}`
                : faturaData.id;
              
              lancamento.fatura = {
                id: faturaData.id,
                numero_fatura: numeroFatura,
                mes: faturaData.mes,
                ano: faturaData.ano,
                data_vencimento: faturaData.data_vencimento,
                unidade_beneficiaria: unidadeData ? {
                  numero_uc: unidadeData.numero_uc || '',
                  apelido: unidadeData.apelido || null,
                  endereco: unidadeData.endereco || ''
                } : {
                  numero_uc: '',
                  apelido: null,
                  endereco: ''
                }
              };
            }
          }
        }
        
        // Se for despesa, buscar mais detalhes do investidor
        if (item.tipo === 'despesa' && item.investidor_id) {
          const { data: investidorData } = await supabase
            .from('investidores')
            .select('nome_investidor, documento, telefone, email')
            .eq('id', item.investidor_id)
            .single();
            
          if (investidorData) {
            lancamento.investidor = investidorData;
          }
          
          // Se tiver pagamento de usina, buscar detalhes separadamente
          if (item.pagamento_usina_id) {
            const { data: pagamentoData } = await supabase
              .from('pagamentos_usina')
              .select(`
                id,
                mes,
                ano,
                geracao_kwh,
                valor_total,
                status,
                data_vencimento,
                data_pagamento,
                usina_id
              `)
              .eq('id', item.pagamento_usina_id)
              .single();
              
            if (pagamentoData) {
              // Buscar informações da usina separadamente
              let usinaInfo = null;
              
              if (pagamentoData.usina_id) {
                const { data: usinaData } = await supabase
                  .from('usinas')
                  .select(`
                    unidade_usina_id
                  `)
                  .eq('id', pagamentoData.usina_id)
                  .single();
                  
                if (usinaData && usinaData.unidade_usina_id) {
                  const { data: unidadeUsinaData } = await supabase
                    .from('unidades_usina')
                    .select('numero_uc, apelido')
                    .eq('id', usinaData.unidade_usina_id)
                    .single();
                    
                  if (unidadeUsinaData) {
                    usinaInfo = {
                      unidade_usina: unidadeUsinaData
                    };
                  }
                }
              }
              
              lancamento.pagamento_usina = {
                id: pagamentoData.id,
                mes: pagamentoData.mes,
                ano: pagamentoData.ano,
                geracao_kwh: pagamentoData.geracao_kwh,
                valor_total: pagamentoData.valor_total,
                status: pagamentoData.status,
                data_vencimento: pagamentoData.data_vencimento,
                data_pagamento: pagamentoData.data_pagamento,
                usina: usinaInfo
              };
            }
          }
        }
      } catch (e) {
        console.error('Erro ao buscar dados relacionados:', e);
      }
      
      return lancamento as LancamentoFinanceiro;
    }));
    
    // Aplicar filtros adicionais se necessário
    return lancamentosEnriquecidos.filter(lancamento => {
      // Filtrar por status se especificado e não for 'todos'
      if (status && status !== 'todos' && lancamento.status !== status) {
        return false;
      }
      
      // Filtrar por texto de busca
      if (busca && busca.trim() !== '') {
        const termoBusca = busca.toLowerCase().trim();
        // Buscar em vários campos
        const descricao = lancamento.descricao?.toLowerCase() || '';
        const cooperadoNome = lancamento.cooperado?.nome?.toLowerCase() || '';
        const investidorNome = lancamento.investidor?.nome_investidor?.toLowerCase() || '';
        const documento = lancamento.cooperado?.documento || lancamento.investidor?.documento || '';
        const numeroUC = lancamento.fatura?.unidade_beneficiaria?.numero_uc?.toLowerCase() || 
                       lancamento.pagamento_usina?.usina?.unidade_usina?.numero_uc?.toLowerCase() || '';
        
        return descricao.includes(termoBusca) || 
               cooperadoNome.includes(termoBusca) || 
               investidorNome.includes(termoBusca) || 
               documento.includes(termoBusca) ||
               numeroUC.includes(termoBusca);
      }
      
      return true;
    });
  } catch (error) {
    console.error('Exceção não tratada ao buscar lançamentos:', error);
    
    // Tenta um fallback direto caso a função RPC falhe
    try {
      console.log('Tentando método alternativo de busca...');
      
      // Consulta direta mais simples evitando joins complexos
      let query = supabase
        .from('lancamentos_financeiros')
        .select('*')
        .eq('tipo', tipo)
        .is('deleted_at', null);
        
      // Aplicar filtros de data diretamente na query
      if (dataInicio) {
        const dataInicioFormatada = new Date(dataInicio).toISOString();
        query = query.gte('data_vencimento', dataInicioFormatada);
      }
      
      if (dataFim) {
        const dataFimFormatada = new Date(dataFim).toISOString();
        query = query.lte('data_vencimento', dataFimFormatada);
      }
      
      const { data, error: fallbackError } = await query;
        
      if (fallbackError) {
        console.error('Erro no método alternativo:', fallbackError);
        return [];
      }
      
      // Buscar relacionamentos manualmente para cada item
      const lancamentosProcessados = await Promise.all((data || []).map(async (item) => {
        // Processar histórico_status
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
        
        // Objeto padrão para o retorno
        const lancamentoProcessado: LancamentoFinanceiro = {
          ...item,
          historico_status: historicoStatus,
          cooperado: null,
          investidor: null,
          fatura: null,
          pagamento_usina: null
        };
        
        try {
          // Buscar cooperado se existir
          if (item.cooperado_id) {
            const { data: cooperadoData } = await supabase
              .from('cooperados')
              .select('nome, documento, telefone, email, numero_cadastro')
              .eq('id', item.cooperado_id)
              .single();
              
            if (cooperadoData) {
              lancamentoProcessado.cooperado = cooperadoData;
            }
          }
          
          // Buscar investidor se existir
          if (item.investidor_id) {
            const { data: investidorData } = await supabase
              .from('investidores')
              .select('nome_investidor, documento, telefone, email')
              .eq('id', item.investidor_id)
              .single();
              
            if (investidorData) {
              lancamentoProcessado.investidor = investidorData;
            }
          }
          
          // Buscar fatura se existir
          if (item.fatura_id) {
            const { data: faturaData } = await supabase
              .from('faturas')
              .select('id, mes, ano, unidade_beneficiaria_id, data_vencimento')
              .eq('id', item.fatura_id)
              .single();
              
            if (faturaData) {
              // Buscar unidade beneficiária
              const { data: unidadeData } = await supabase
                .from('unidades_beneficiarias')
                .select('numero_uc, apelido, endereco')
                .eq('id', faturaData.unidade_beneficiaria_id)
                .single();
                
              // Formatar número da fatura
              const numeroFatura = faturaData.mes && faturaData.ano 
                ? `${faturaData.mes.toString().padStart(2, '0')}/${faturaData.ano}`
                : faturaData.id;
                
              lancamentoProcessado.fatura = {
                id: faturaData.id,
                numero_fatura: numeroFatura,
                mes: faturaData.mes,
                ano: faturaData.ano,
                data_vencimento: faturaData.data_vencimento,
                unidade_beneficiaria: unidadeData ? {
                  numero_uc: unidadeData.numero_uc || '',
                  apelido: unidadeData.apelido || null,
                  endereco: unidadeData.endereco || ''
                } : {
                  numero_uc: '',
                  apelido: null,
                  endereco: ''
                }
              };
            }
          }
          
          // Buscar pagamento de usina se existir
          if (item.pagamento_usina_id) {
            const { data: pagamentoData } = await supabase
              .from('pagamentos_usina')
              .select(`
                id, mes, ano, geracao_kwh, valor_total, status,
                data_vencimento, data_pagamento, usina_id
              `)
              .eq('id', item.pagamento_usina_id)
              .single();
              
            if (pagamentoData) {
              // Buscar usina e unidade de usina
              let usinaInfo = null;
              
              if (pagamentoData.usina_id) {
                const { data: usinaData } = await supabase
                  .from('usinas')
                  .select('unidade_usina_id')
                  .eq('id', pagamentoData.usina_id)
                  .single();
                  
                if (usinaData && usinaData.unidade_usina_id) {
                  const { data: unidadeUsinaData } = await supabase
                    .from('unidades_usina')
                    .select('numero_uc, apelido')
                    .eq('id', usinaData.unidade_usina_id)
                    .single();
                    
                  if (unidadeUsinaData) {
                    usinaInfo = {
                      unidade_usina: unidadeUsinaData
                    };
                  }
                }
              }
              
              lancamentoProcessado.pagamento_usina = {
                id: pagamentoData.id,
                mes: pagamentoData.mes,
                ano: pagamentoData.ano,
                geracao_kwh: pagamentoData.geracao_kwh,
                valor_total: pagamentoData.valor_total,
                status: pagamentoData.status,
                data_vencimento: pagamentoData.data_vencimento,
                data_pagamento: pagamentoData.data_pagamento,
                usina: usinaInfo
              };
            }
          }
        } catch (e) {
          console.error('Erro ao buscar dados relacionados no fallback:', e);
        }
        
        return lancamentoProcessado;
      }));
      
      // Aplicar filtros
      return lancamentosProcessados.filter(lancamento => {
        // Filtrar por status se especificado
        if (status && status !== 'todos' && lancamento.status !== status) {
          return false;
        }
        
        // Filtrar por texto de busca
        if (busca && busca.trim() !== '') {
          const termoBusca = busca.toLowerCase().trim();
          const descricao = lancamento.descricao?.toLowerCase() || '';
          const cooperadoNome = lancamento.cooperado?.nome?.toLowerCase() || '';
          const investidorNome = lancamento.investidor?.nome_investidor?.toLowerCase() || '';
          const documento = lancamento.cooperado?.documento || lancamento.investidor?.documento || '';
          const numeroUC = lancamento.fatura?.unidade_beneficiaria?.numero_uc?.toLowerCase() || 
                         lancamento.pagamento_usina?.usina?.unidade_usina?.numero_uc?.toLowerCase() || '';
          
          return descricao.includes(termoBusca) || 
                 cooperadoNome.includes(termoBusca) || 
                 investidorNome.includes(termoBusca) || 
                 documento.includes(termoBusca) ||
                 numeroUC.includes(termoBusca);
        }
        
        return true;
      });
    } catch (fallbackError) {
      console.error('Também falhou o método alternativo:', fallbackError);
      return [];
    }
  }
}
