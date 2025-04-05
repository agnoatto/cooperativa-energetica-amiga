
/**
 * Hook para gerenciar contas bancárias
 * 
 * Este hook fornece acesso à lista de contas bancárias com filtros
 * e funcionalidades para listar, buscar e atualizar contas.
 */
import { useState, useEffect } from "react";
import { ContaBancaria, TipoContaBancaria } from "@/types/contas-bancos";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface UseContasBancariasParams {
  busca?: string;
  tipo?: TipoContaBancaria;
  status?: string;
  apenasAtivas?: boolean;
}

export function useContasBancarias(params: UseContasBancariasParams = {}) {
  const { busca = "", tipo, status, apenasAtivas = false } = params;
  const [data, setData] = useState<ContaBancaria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchContas = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('contas_bancarias')
        .select('*')
        .is('deleted_at', null);
      
      // Aplicar filtros
      if (busca) {
        query = query.or(`nome.ilike.%${busca}%,banco.ilike.%${busca}%,agencia.ilike.%${busca}%,conta.ilike.%${busca}%`);
      }
      
      if (tipo) {
        query = query.eq('tipo', tipo);
      }
      
      if (status) {
        query = query.eq('status', status);
      }

      if (apenasAtivas) {
        query = query.eq('status', 'ativa');
      }
      
      const { data: contas, error } = await query.order('nome');
      
      if (error) {
        throw error;
      }
      
      setData(contas as ContaBancaria[]);
    } catch (err) {
      console.error("Erro ao buscar contas bancárias:", err);
      setError(err instanceof Error ? err : new Error("Erro desconhecido ao buscar contas"));
      toast.error("Erro ao buscar contas bancárias");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContas();
  }, [busca, tipo, status, apenasAtivas]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchContas,
  };
}
