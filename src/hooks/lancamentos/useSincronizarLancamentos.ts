
/**
 * Hook para sincronização de lançamentos financeiros com faturas e pagamentos
 * 
 * Este hook permite executar a sincronização de lançamentos financeiros
 * a partir das faturas e pagamentos de usinas existentes, identificando itens 
 * sem lançamentos correspondentes e criando novos lançamentos para eles.
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

// Interface para definir o formato do resultado da função RPC
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
          description: erroFuncao.message || "Erro ao sincronizar lançamentos com faturas e pagamentos.",
        });
        setErro(new Error(erroFuncao.message));
        return null;
      }
      
      // Garantir que resultadoFuncao seja um objeto com as propriedades esperadas
      if (!resultadoFuncao) {
        toast({
          variant: "destructive",
          title: "Erro ao sincronizar lançamentos",
          description: "Nenhum resultado retornado pelo servidor.",
        });
        setErro(new Error("Nenhum resultado retornado"));
        return null;
      }
      
      // Convertendo o resultadoFuncao para um objeto tipado com segurança
      // Usando type assertion com tratamento de tipo
      const objResultado = resultadoFuncao as Record<string, any>;
      
      const resultado: ResultadoSincronizacao = {
        total_sincronizado: typeof objResultado.total_sincronizado === 'number' ? objResultado.total_sincronizado : 0,
        data_execucao: (typeof objResultado.data_execucao === 'string') ? objResultado.data_execucao : new Date().toISOString(),
        detalhes: Array.isArray(objResultado.detalhes) ? objResultado.detalhes : []
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
