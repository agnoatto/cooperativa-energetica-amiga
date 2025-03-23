
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

export interface ResultadoSincronizacao {
  total_sincronizado: number;
  data_execucao: string;
  detalhes: string[];
}

export function useSincronizarLancamentos() {
  const [isSincronizando, setIsSincronizando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoSincronizacao | null>(null);
  const [erro, setErro] = useState<Error | null>(null);

  const sincronizar = async () => {
    setIsSincronizando(true);
    setResultado(null);
    setErro(null);

    try {
      // Chamar a função rpc para sincronizar lançamentos manualmente 
      // (sem usar a função do banco de dados que está com erro)
      const { data, error } = await supabase
        .from('faturas')
        .select('id, valor_assinatura, data_vencimento, unidade_beneficiaria_id')
        .in('status', ['enviada', 'reenviada', 'atrasada', 'paga', 'finalizada'])
        .is('deleted_at', null);

      if (error) {
        throw error;
      }

      // Para cada fatura, verificar se já existe um lançamento correspondente
      let totalSincronizado = 0;
      const detalhes: string[] = [];

      for (const fatura of data || []) {
        if (!fatura.valor_assinatura || fatura.valor_assinatura <= 0) {
          continue; // Ignorar faturas com valor zero ou nulo
        }

        // Verificar se já existe lançamento para esta fatura
        const { data: lancamentosExistentes, error: erroConsulta } = await supabase
          .from('lancamentos_financeiros')
          .select('id')
          .eq('fatura_id', fatura.id)
          .eq('tipo', 'receita')
          .is('deleted_at', null);

        if (erroConsulta) {
          console.error('Erro ao verificar lançamento existente:', erroConsulta);
          continue;
        }

        // Se não existir lançamento, criar um novo
        if (!lancamentosExistentes || lancamentosExistentes.length === 0) {
          // Buscar cooperado para esta unidade beneficiária
          const { data: unidadeBeneficiaria } = await supabase
            .from('unidades_beneficiarias')
            .select('cooperado_id, apelido')
            .eq('id', fatura.unidade_beneficiaria_id)
            .single();

          if (!unidadeBeneficiaria) continue;

          // Criar o lançamento
          const { error: erroInsercao } = await supabase
            .from('lancamentos_financeiros')
            .insert({
              tipo: 'receita',
              status: 'pendente',
              descricao: `Fatura ${unidadeBeneficiaria.apelido || 'Unidade'} - ${fatura.id.slice(0, 8)}`,
              valor: fatura.valor_assinatura,
              data_vencimento: fatura.data_vencimento,
              cooperado_id: unidadeBeneficiaria.cooperado_id,
              fatura_id: fatura.id,
              historico_status: [
                {
                  status: 'pendente',
                  data: new Date().toISOString(),
                  status_anterior: null
                }
              ]
            });

          if (erroInsercao) {
            console.error('Erro ao criar lançamento:', erroInsercao);
            detalhes.push(`Erro ao criar lançamento para fatura ${fatura.id}: ${erroInsercao.message}`);
          } else {
            totalSincronizado++;
            detalhes.push(`Lançamento criado para fatura ${fatura.id}`);
          }
        }
      }

      // Criar o objeto de resultado manualmente
      const resultadoManual: ResultadoSincronizacao = {
        total_sincronizado: totalSincronizado,
        data_execucao: new Date().toISOString(),
        detalhes: detalhes
      };

      setResultado(resultadoManual);
      return resultadoManual;
    } catch (error) {
      console.error('[useSincronizarLancamentos] Erro ao sincronizar lançamentos:', error);
      
      setErro(error instanceof Error ? error : new Error('Erro desconhecido ao sincronizar lançamentos'));
      
      toast({
        variant: "destructive",
        title: "Erro ao sincronizar lançamentos",
        description: error instanceof Error 
          ? error.message 
          : "Ocorreu um erro desconhecido ao sincronizar lançamentos.",
      });
      
      return null;
    } finally {
      setIsSincronizando(false);
    }
  };

  return {
    sincronizar,
    isSincronizando,
    resultado,
    erro,
  };
}
