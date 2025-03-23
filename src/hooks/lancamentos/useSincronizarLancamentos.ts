
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

interface ResultadoSincronizacao {
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
      // Chamar a função do banco de dados para executar a sincronização
      const { data, error } = await supabase
        .rpc('executar_sincronizacao_lancamentos');

      if (error) {
        throw error;
      }

      // Processar o resultado
      setResultado(data as ResultadoSincronizacao);
      
      return data;
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
