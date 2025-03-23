
/**
 * Hook para sincronização de lançamentos financeiros com faturas
 * 
 * Este hook permite executar a sincronização de lançamentos financeiros
 * a partir das faturas existentes, identificando faturas sem lançamentos
 * correspondentes e criando novos lançamentos para elas.
 * 
 * @example
 * const { sincronizar, isSincronizando, resultado } = useSincronizarLancamentos();
 * 
 * // Chamando a função de sincronização
 * const handleClick = async () => {
 *   await sincronizar();
 *   if (resultado) {
 *     console.log(`${resultado.total_sincronizado} lançamentos sincronizados`);
 *   }
 * };
 */

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { StatusLancamento, TipoLancamento } from "@/types/financeiro";

export interface ResultadoSincronizacao {
  total_sincronizado: number;
  data_execucao: string;
  detalhes: string[];
}

export function useSincronizarLancamentos() {
  const [isSincronizando, setIsSincronizando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoSincronizacao | null>(null);
  const [erro, setErro] = useState<Error | null>(null);

  // Função principal para sincronizar lançamentos
  const sincronizar = async () => {
    setIsSincronizando(true);
    setResultado(null);
    setErro(null);

    try {
      console.log('[useSincronizarLancamentos] Iniciando sincronização...');
      
      // Tentar usar a função RPC do banco de dados para sincronização
      const { data: resultadoFuncao, error: erroFuncao } = await supabase
        .rpc('executar_sincronizacao_lancamentos');
      
      if (erroFuncao) {
        console.warn('[useSincronizarLancamentos] Erro ao usar função do banco:', erroFuncao);
        console.log('[useSincronizarLancamentos] Tentando método alternativo via JS...');
        
        // Se a função do banco falhar, tenta o método JS
        return await sincronizarViaJS();
      }
      
      // Se chegou aqui, a função do banco funcionou
      console.log('[useSincronizarLancamentos] Sincronização via função do banco concluída:', resultadoFuncao);
      
      // Converter resultado para o formato esperado
      // Precisamos fazer type casting adequado pois o retorno é um JSON
      const resultado = resultadoFuncao as {
        total_sincronizado: number;
        data_execucao: string;
        detalhes: string[];
      };
      
      const resultadoFinal: ResultadoSincronizacao = {
        total_sincronizado: resultado.total_sincronizado || 0,
        data_execucao: resultado.data_execucao || new Date().toISOString(),
        detalhes: resultado.detalhes || []
      };
      
      setResultado(resultadoFinal);

      // Se não houve sincronização, tentar o método JS como fallback
      if (resultadoFinal.total_sincronizado === 0) {
        console.log('[useSincronizarLancamentos] Nenhuma fatura sincronizada via banco, tentando método JS...');
        return await sincronizarViaJS();
      }
      
      return resultadoFinal;
    } catch (error) {
      console.error('[useSincronizarLancamentos] Erro crítico ao sincronizar:', error);
      
      // Em caso de erro, tenta o método JS
      try {
        return await sincronizarViaJS();
      } catch (jsError) {
        setErro(jsError instanceof Error ? jsError : new Error('Erro desconhecido ao sincronizar lançamentos'));
        
        toast({
          variant: "destructive",
          title: "Erro ao sincronizar lançamentos",
          description: jsError instanceof Error 
            ? jsError.message 
            : "Ocorreu um erro desconhecido ao sincronizar lançamentos.",
        });
        
        return null;
      }
    } finally {
      setIsSincronizando(false);
    }
  };

  // Método alternativo de sincronização via JavaScript
  const sincronizarViaJS = async (): Promise<ResultadoSincronizacao | null> => {
    try {
      // Buscar faturas que precisam de lançamentos, incluindo aquelas com valor zero
      // para que possamos validar e encontrar problemas
      const { data: todasFaturas, error: errorFaturas } = await supabase
        .from('faturas')
        .select(`
          id, 
          valor_assinatura, 
          data_vencimento, 
          unidade_beneficiaria_id,
          status,
          data_pagamento,
          valor_adicional
        `)
        .in('status', ['enviada', 'reenviada', 'atrasada', 'paga', 'finalizada']);

      if (errorFaturas) {
        throw new Error(`Erro ao buscar faturas: ${errorFaturas.message}`);
      }

      // Contar quantas faturas encontramos
      console.log(`[useSincronizarLancamentos] Encontradas ${todasFaturas?.length || 0} faturas com status elegível`);

      // Buscar todos os lançamentos existentes para faturas
      const { data: lancamentosExistentes, error: errorLancamentos } = await supabase
        .from('lancamentos_financeiros')
        .select('fatura_id')
        .is('deleted_at', null)
        .not('fatura_id', 'is', null);

      if (errorLancamentos) {
        throw new Error(`Erro ao buscar lançamentos existentes: ${errorLancamentos.message}`);
      }

      // Criar um conjunto de IDs de faturas que já possuem lançamentos
      const faturasComLancamentos = new Set(
        (lancamentosExistentes || []).map(l => l.fatura_id)
      );

      console.log(`[useSincronizarLancamentos] Já existem lançamentos para ${faturasComLancamentos.size} faturas`);

      // Filtrar faturas que ainda não têm lançamentos
      const faturasSemLancamentos = (todasFaturas || []).filter(
        fatura => !faturasComLancamentos.has(fatura.id)
      );

      console.log(`[useSincronizarLancamentos] Faturas sem lançamentos: ${faturasSemLancamentos.length}`);

      // Inicializar variáveis para tracking
      let totalSincronizado = 0;
      const detalhes: string[] = [];
      const erros: string[] = [];

      // Processar cada fatura sem lançamento
      for (const fatura of faturasSemLancamentos) {
        try {
          console.log(`Processando fatura: ${fatura.id}, valor: ${fatura.valor_assinatura}`);
          
          // Buscar informações da unidade beneficiária
          const { data: unidadeBeneficiaria, error: erroUnidade } = await supabase
            .from('unidades_beneficiarias')
            .select('cooperado_id, apelido, numero_uc')
            .eq('id', fatura.unidade_beneficiaria_id)
            .single();

          if (erroUnidade) {
            const mensagemErro = `Erro ao buscar unidade para fatura ${fatura.id.slice(0, 8)}: ${erroUnidade.message}`;
            console.error(mensagemErro);
            erros.push(mensagemErro);
            continue;
          }

          if (!unidadeBeneficiaria) {
            const mensagemErro = `Unidade não encontrada para fatura ${fatura.id.slice(0, 8)}`;
            console.error(mensagemErro);
            erros.push(mensagemErro);
            continue;
          }

          // Determinar status do lançamento com base no status da fatura
          let statusLancamento: StatusLancamento = 'pendente';
          let valorPago = null;
          
          if (fatura.status === 'paga') {
            statusLancamento = 'pago';
            valorPago = fatura.valor_assinatura + (fatura.valor_adicional || 0);
          } else if (fatura.status === 'atrasada') {
            statusLancamento = 'atrasado';
          }

          // Criar descrição para o lançamento
          const descricao = `Fatura ${unidadeBeneficiaria.apelido || unidadeBeneficiaria.numero_uc || 'Unidade'} - ${fatura.id.slice(0, 8)}`;

          // Validar valor (mesmo que seja zero, para diagnóstico)
          const valorLancamento = fatura.valor_assinatura || 0;

          // Mostrar detalhes sobre o valor
          console.log(`Fatura ${fatura.id.slice(0, 8)}: valor=${valorLancamento}, status=${fatura.status}`);

          // Criar o lançamento financeiro
          const { error: erroInsercao } = await supabase
            .from('lancamentos_financeiros')
            .insert({
              tipo: 'receita' as TipoLancamento,
              status: statusLancamento,
              descricao: descricao,
              valor: valorLancamento,
              valor_original: valorLancamento,
              valor_pago: valorPago,
              data_vencimento: fatura.data_vencimento,
              data_pagamento: fatura.data_pagamento,
              cooperado_id: unidadeBeneficiaria.cooperado_id,
              fatura_id: fatura.id,
              historico_status: [
                {
                  data: new Date().toISOString(),
                  status_anterior: null,
                  novo_status: statusLancamento
                }
              ]
            });

          if (erroInsercao) {
            const mensagemErro = `Erro ao criar lançamento para fatura ${fatura.id.slice(0, 8)}: ${erroInsercao.message}`;
            console.error(mensagemErro);
            erros.push(mensagemErro);
            continue;
          }

          totalSincronizado++;
          const mensagemSucesso = `Lançamento criado para fatura ${fatura.id.slice(0, 8)} valor=${valorLancamento}`;
          detalhes.push(mensagemSucesso);
          console.log(mensagemSucesso);
        } catch (error) {
          const mensagemErro = `Erro ao processar fatura ${fatura.id.slice(0, 8)}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`;
          console.error(mensagemErro);
          erros.push(mensagemErro);
        }
      }

      // Se houver erros, adicionar ao final dos detalhes
      if (erros.length > 0) {
        detalhes.push('--- Erros encontrados ---');
        erros.forEach(erro => detalhes.push(erro));
      }

      // Criar objeto de resultado
      const resultadoFinal: ResultadoSincronizacao = {
        total_sincronizado: totalSincronizado,
        data_execucao: new Date().toISOString(),
        detalhes: detalhes
      };

      setResultado(resultadoFinal);
      return resultadoFinal;
    } catch (error) {
      console.error('[useSincronizarLancamentos] Erro ao sincronizar lançamentos via JS:', error);
      
      setErro(error instanceof Error ? error : new Error('Erro desconhecido ao sincronizar lançamentos'));
      
      toast({
        variant: "destructive",
        title: "Erro ao sincronizar lançamentos",
        description: error instanceof Error 
          ? error.message 
          : "Ocorreu um erro desconhecido ao sincronizar lançamentos.",
      });
      
      return null;
    }
  };

  return {
    sincronizar,
    isSincronizando,
    resultado,
    erro,
  };
}
