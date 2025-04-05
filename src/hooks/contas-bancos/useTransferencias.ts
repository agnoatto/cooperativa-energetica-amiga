
/**
 * Hook para gerenciar transferências bancárias
 * 
 * Este hook fornece funcionalidades para buscar, criar, atualizar
 * e excluir transferências bancárias.
 */
import { useState, useEffect } from "react";
import { TransferenciaBancaria } from "@/types/contas-bancos";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function useTransferencias() {
  const [transferencias, setTransferencias] = useState<TransferenciaBancaria[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTransferencias = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('transferencias_bancarias')
        .select('*')
        .is('deleted_at', null);

      if (error) throw error;
      
      // Convertemos para o tipo TransferenciaBancaria
      setTransferencias(data as unknown as TransferenciaBancaria[]);
    } catch (err) {
      console.error("Erro ao buscar transferências bancárias:", err);
      setError(err instanceof Error ? err : new Error("Erro desconhecido ao buscar transferências"));
      toast.error("Erro ao buscar transferências bancárias");
    } finally {
      setIsLoading(false);
    }
  };

  const salvarTransferencia = async (transferencia: Partial<TransferenciaBancaria>) => {
    setIsLoading(true);
    setError(null);

    try {
      // Se for atualização
      if (transferencia.id) {
        const { error } = await supabase
          .from('transferencias_bancarias')
          .update({
            ...transferencia,
            updated_at: new Date().toISOString()
          })
          .eq('id', transferencia.id);

        if (error) throw error;
        
        toast.success("Transferência bancária atualizada com sucesso!");
        return true;
      }

      // Se for nova transferência
      const novaTransferencia = {
        descricao: transferencia.descricao || "",
        data_transferencia: transferencia.data_transferencia || new Date().toISOString(),
        status: transferencia.status || "pendente",
        valor: transferencia.valor || 0,
        // Outros campos do objeto de transferência
        ...transferencia,
        // Adicionar empresa_id que o Supabase espera (será substituído pelo trigger)
        empresa_id: '00000000-0000-0000-0000-000000000000'
      };

      const { error } = await supabase
        .from('transferencias_bancarias')
        .insert(novaTransferencia);

      if (error) throw error;
      
      toast.success("Transferência bancária criada com sucesso!");
      return true;

    } catch (err) {
      console.error("Erro ao salvar transferência bancária:", err);
      setError(err instanceof Error ? err : new Error("Erro desconhecido ao salvar transferência"));
      toast.error("Erro ao salvar transferência bancária");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const excluirTransferencia = async (transferenciaId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Soft delete
      const { error } = await supabase
        .from('transferencias_bancarias')
        .update({ 
          deleted_at: new Date().toISOString(),
          status: 'cancelada'
        })
        .eq('id', transferenciaId);

      if (error) throw error;
      
      toast.success("Transferência bancária excluída com sucesso!");
      return true;

    } catch (err) {
      console.error("Erro ao excluir transferência bancária:", err);
      setError(err instanceof Error ? err : new Error("Erro desconhecido ao excluir transferência"));
      toast.error("Erro ao excluir transferência bancária");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransferencias();
  }, []);

  return {
    transferencias,
    isLoading,
    error,
    fetchTransferencias,
    salvarTransferencia,
    excluirTransferencia,
  };
}
