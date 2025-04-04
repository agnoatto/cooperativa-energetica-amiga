
/**
 * Hook para gerenciar uma conta bancária individual
 * 
 * Este hook fornece funcionalidades para buscar, criar, atualizar
 * e excluir uma conta bancária específica.
 */
import { useState, useEffect } from "react";
import { ContaBancaria } from "@/types/contas-bancos";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function useContaBancaria(id?: string) {
  const [data, setData] = useState<ContaBancaria | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchConta = async () => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const { data: conta, error } = await supabase
        .from('contas_bancarias')
        .select('*')
        .eq('id', id)
        .is('deleted_at', null)
        .single();

      if (error) throw error;
      
      setData(conta as ContaBancaria);
    } catch (err) {
      console.error("Erro ao buscar conta bancária:", err);
      setError(err instanceof Error ? err : new Error("Erro desconhecido ao buscar conta"));
      toast.error("Erro ao buscar conta bancária");
    } finally {
      setIsLoading(false);
    }
  };

  const salvarContaBancaria = async (contaData: Partial<ContaBancaria>) => {
    setIsLoading(true);
    setError(null);

    try {
      // Se for uma atualização
      if (id) {
        const { error } = await supabase
          .from('contas_bancarias')
          .update({
            ...contaData,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);

        if (error) throw error;
        
        toast.success("Conta bancária atualizada com sucesso!");
        return true;
      }
      
      // Se for uma nova conta - assegurando campos obrigatórios
      const novaConta = {
        nome: contaData.nome || "",
        tipo: contaData.tipo || "corrente",
        status: contaData.status || "ativa",
        data_saldo_inicial: contaData.data_saldo_inicial || new Date().toISOString(),
        saldo_inicial: contaData.saldo_inicial || 0,
        saldo_atual: contaData.saldo_inicial || 0,
        // O próprio Supabase preencherá o empresa_id através do trigger propagar_empresa_id_contas
        empresa_id: '00000000-0000-0000-0000-000000000000' // Valor provisório, será substituído pelo trigger
      };

      // Adiciona campos obrigatórios que o Supabase espera
      const contaParaSalvar = {
        ...novaConta,
        ...contaData,
      };

      const { error } = await supabase
        .from('contas_bancarias')
        .insert(contaParaSalvar);

      if (error) throw error;
      
      toast.success("Conta bancária criada com sucesso!");
      return true;

    } catch (err) {
      console.error("Erro ao salvar conta bancária:", err);
      setError(err instanceof Error ? err : new Error("Erro desconhecido ao salvar conta"));
      toast.error("Erro ao salvar conta bancária");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const excluirContaBancaria = async (contaId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Soft delete
      const { error } = await supabase
        .from('contas_bancarias')
        .update({ 
          deleted_at: new Date().toISOString(),
          status: 'inativa'
        })
        .eq('id', contaId);

      if (error) throw error;
      
      toast.success("Conta bancária excluída com sucesso!");
      return true;

    } catch (err) {
      console.error("Erro ao excluir conta bancária:", err);
      setError(err instanceof Error ? err : new Error("Erro desconhecido ao excluir conta"));
      toast.error("Erro ao excluir conta bancária");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchConta();
    }
  }, [id]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchConta,
    salvarContaBancaria,
    excluirContaBancaria,
  };
}
