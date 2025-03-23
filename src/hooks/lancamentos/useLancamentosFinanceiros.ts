
/**
 * Hook para consulta e gerenciamento de lançamentos financeiros
 * 
 * Este hook utiliza React Query para buscar e gerenciar o estado de lançamentos financeiros
 * do tipo receita ou despesa, aplicando filtros diversos como status, período de datas e texto.
 * Também implementa estratégias de cache otimizado e revalidação automática para garantir
 * dados atualizados enquanto proporciona boa performance.
 * 
 * @example
 * // Exemplo de uso básico:
 * const { data, isLoading, error } = useLancamentosFinanceiros({
 *   tipo: 'receita',
 *   status: 'pendente',
 *   dataInicio: '2023-01-01',
 *   dataFim: '2023-12-31'
 * });
 */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { UseLancamentosFinanceirosOptions } from "./types";
import { fetchLancamentos } from "./queries";
import { toast } from "@/components/ui/use-toast";

export function useLancamentosFinanceiros(options: UseLancamentosFinanceirosOptions) {
  const [tentativasErro, setTentativasErro] = useState(0);

  // Usar o hook useQuery do TanStack Query para gerenciar o estado da consulta
  const query = useQuery({
    queryKey: ['lancamentos', options.tipo, options.status, options.busca, options.dataInicio, options.dataFim],
    queryFn: () => fetchLancamentos(options),
    retry: 2, // Tentar novamente até 2 vezes em caso de erro
    staleTime: 1000 * 60 * 5, // Considerar dados "frescos" por 5 minutos
    refetchOnWindowFocus: true, // Recarregar ao focar a janela
    refetchOnMount: true, // Recarregar ao montar o componente
    meta: {
      errorMessage: `Erro ao carregar lançamentos do tipo ${options.tipo}`
    }
  });

  // Lidar com erros de consulta
  if (query.error && query.fetchStatus !== 'fetching') {
    // Incrementar contador de tentativas para fins de debugging
    setTentativasErro(prev => prev + 1);
    
    // Exibir mensagem de erro para o usuário
    toast({
      variant: "destructive",
      title: "Erro ao carregar lançamentos",
      description: query.error instanceof Error 
        ? query.error.message 
        : "Ocorreu um erro desconhecido. Tente novamente mais tarde.",
    });
    
    // Logar o erro no console com informações de contexto
    console.error(`[useLancamentosFinanceiros] Erro na tentativa ${tentativasErro + 1}:`, query.error);
    console.error('Opções de consulta:', JSON.stringify(options));
    console.error('[useLancamentosFinanceiros] Query falhou:', query.error);
  }

  // Log de sucesso quando os dados são carregados
  if (query.data && query.isSuccess) {
    console.log(`[useLancamentosFinanceiros] Consulta concluída. Resultados: ${query.data?.length || 0}`);
  }

  return {
    ...query,
    tentativasErro,
    resetarTentativas: () => setTentativasErro(0)
  };
}
