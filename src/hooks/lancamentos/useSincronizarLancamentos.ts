
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

  // Função principal para sincronizar lançamentos
  const sincronizar = async () => {
    setIsSincronizando(true);
    setResultado(null);
    setErro(null);

    try {
      console.log('[useSincronizarLancamentos] Iniciando sincronização...');
      
      // Chamar a função RPC do banco de dados
      const { data: resultadoFuncao, error: erroFuncao } = await supabase
        .rpc('executar_sincronizacao_lancamentos');
      
      if (erroFuncao) {
        console.error('[useSincronizarLancamentos] Erro ao sincronizar:', erroFuncao);
        toast({
          variant: "destructive",
          title: "Erro ao sincronizar lançamentos",
          description: erroFuncao.message || "Erro ao sincronizar lançamentos com faturas.",
        });
        setErro(new Error(erroFuncao.message));
        return null;
      }
      
      // Converter resultado para o formato esperado
      const resultado: ResultadoSincronizacao = {
        total_sincronizado: resultadoFuncao?.total_sincronizado || 0,
        data_execucao: resultadoFuncao?.data_execucao || new Date().toISOString(),
        detalhes: resultadoFuncao?.detalhes || []
      };
      
      setResultado(resultado);
      
      // Mostrar notificação de sucesso
      toast({
        title: "Sincronização concluída",
        description: `${resultado.total_sincronizado} lançamentos foram sincronizados com sucesso.`,
      });
      
      return resultado;
    } catch (error) {
      console.error('[useSincronizarLancamentos] Erro ao sincronizar:', error);
      
      const mensagemErro = error instanceof Error 
        ? error.message 
        : "Ocorreu um erro desconhecido ao sincronizar lançamentos.";
      
      toast({
        variant: "destructive",
        title: "Erro ao sincronizar lançamentos",
        description: mensagemErro,
      });
      
      setErro(error instanceof Error ? error : new Error(mensagemErro));
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
