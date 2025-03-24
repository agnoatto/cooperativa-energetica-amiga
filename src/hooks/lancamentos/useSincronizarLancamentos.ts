
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
      
      // Primeiro tentar usar a função do banco de dados (mais eficiente)
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
      // Buscar faturas que precisam de lançamentos
      // Apenas faturas com status que já foram enviadas aos clientes
      const { data: faturas, error: errorFaturas } = await supabase
        .from('faturas')
        .select(`
          id, 
          valor_assinatura, 
          data_vencimento, 
          unidade_beneficiaria_id,
          status,
          data_pagamento,
          valor_adicional,
          created_at
        `)
        .in('status', ['enviada', 'reenviada', 'atrasada', 'paga', 'finalizada'])
        .order('id', { ascending: true });

      if (errorFaturas) {
        console.error('Erro ao buscar faturas:', errorFaturas);
        throw new Error(`Erro ao buscar faturas: ${errorFaturas.message}`);
      }

      // Inicializar variáveis para tracking
      let totalSincronizado = 0;
      const detalhes: string[] = [];

      // Processar cada fatura
      for (const fatura of faturas || []) {
        console.log(`Processando fatura: ${fatura.id}, valor: ${fatura.valor_assinatura}`);
        
        // Ignorar faturas com valor zero/nulo
        if (!fatura.valor_assinatura || fatura.valor_assinatura <= 0) {
          detalhes.push(`Fatura ${fatura.id.slice(0, 8)} ignorada (valor zero ou nulo)`);
          continue;
        }

        // Verificar se já existe lançamento para esta fatura
        const { data: lancamentosExistentes, error: erroConsulta } = await supabase
          .from('lancamentos_financeiros')
          .select('id')
          .eq('fatura_id', fatura.id)
          .eq('tipo', 'receita')
          .is('deleted_at', null);

        if (erroConsulta) {
          console.error(`Erro ao verificar lançamento para fatura ${fatura.id}:`, erroConsulta);
          detalhes.push(`Erro ao verificar lançamento para fatura ${fatura.id.slice(0, 8)}: ${erroConsulta.message}`);
          continue;
        }

        // Se já existe lançamento, pular
        if (lancamentosExistentes && lancamentosExistentes.length > 0) {
          console.log(`Fatura ${fatura.id} já possui lançamento`);
          continue;
        }

        // Buscar informações da unidade beneficiária
        const { data: unidadeBeneficiaria, error: erroUnidade } = await supabase
          .from('unidades_beneficiarias')
          .select('cooperado_id, apelido, numero_uc')
          .eq('id', fatura.unidade_beneficiaria_id)
          .single();

        if (erroUnidade) {
          console.error(`Erro ao buscar unidade para fatura ${fatura.id}:`, erroUnidade);
          detalhes.push(`Erro ao buscar unidade para fatura ${fatura.id.slice(0, 8)}: ${erroUnidade.message}`);
          continue;
        }

        if (!unidadeBeneficiaria) {
          detalhes.push(`Unidade não encontrada para fatura ${fatura.id.slice(0, 8)}`);
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
        const descricao = unidadeBeneficiaria.apelido 
          ? `Fatura ${unidadeBeneficiaria.apelido} - ${fatura.id.slice(0, 8)}`
          : `Fatura UC ${unidadeBeneficiaria.numero_uc} - ${fatura.id.slice(0, 8)}`;

        // Criar o lançamento financeiro
        const { error: erroInsercao } = await supabase
          .from('lancamentos_financeiros')
          .insert({
            tipo: 'receita' as TipoLancamento,
            status: statusLancamento,
            descricao: descricao,
            valor: fatura.valor_assinatura,
            valor_original: fatura.valor_assinatura,
            valor_pago: valorPago,
            data_vencimento: fatura.data_vencimento,
            data_pagamento: fatura.data_pagamento,
            cooperado_id: unidadeBeneficiaria.cooperado_id,
            fatura_id: fatura.id,
            created_at: fatura.created_at,
            historico_status: [
              {
                data: new Date().toISOString(),
                status_anterior: null,
                novo_status: statusLancamento
              }
            ]
          });

        if (erroInsercao) {
          console.error(`Erro ao criar lançamento para fatura ${fatura.id}:`, erroInsercao);
          detalhes.push(`Erro ao criar lançamento para fatura ${fatura.id.slice(0, 8)}: ${erroInsercao.message}`);
        } else {
          totalSincronizado++;
          detalhes.push(`Lançamento criado para fatura ${fatura.id.slice(0, 8)}`);
        }
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
