
import { useDeleteFatura } from "./faturas/useDeleteFatura";
import { useGerarFaturas } from "./faturas/useGerarFaturas";
import { useFetchFaturas } from "./faturas/useFetchFaturas";
import { useUpdateFaturaStatus } from "./faturas/useUpdateFaturaStatus";
import { useUpdateFatura } from "./faturas/useUpdateFatura";
import type { UseFaturasResult, UpdateFaturaStatusInput } from "./faturas/types";
import type { UpdateFaturaInput } from "./faturas/types/updateFatura";

export const useFaturas = (currentDate: Date): UseFaturasResult => {
  const { data: faturas, isLoading, refetch } = useFetchFaturas(currentDate);
  const deleteFaturaMutation = useDeleteFatura();
  const gerarFaturasMutation = useGerarFaturas(currentDate);
  const updateFaturaStatusMutation = useUpdateFaturaStatus();
  const updateFaturaMutation = useUpdateFatura();

  console.log("[useFaturas] hook - faturas:", faturas?.length || 0, "itens");
  console.log("[useFaturas] hook - isLoading:", isLoading);

  return {
    faturas,
    isLoading,
    gerarFaturas: () => gerarFaturasMutation.mutate(),
    isGenerating: gerarFaturasMutation.isPending,
    deleteFatura: (id: string) => deleteFaturaMutation.mutate(id),
    refetch, // Expondo a função de refetch
    updateFaturaStatus: async (data: UpdateFaturaStatusInput) => {
      try {
        console.log('[useFaturas] Iniciando atualização de status:', data);
        await updateFaturaStatusMutation.mutateAsync(data);
        console.log('[useFaturas] Atualização de status concluída');
        // Forçar atualização após mudança de status
        refetch();
      } catch (error) {
        console.error('[useFaturas] Erro ao atualizar status:', error);
        throw error;
      }
    },
    updateFatura: async (data: UpdateFaturaInput) => {
      try {
        console.log('[useFaturas] Iniciando atualização de fatura:', data);
        const updatedFatura = await updateFaturaMutation.mutateAsync(data);
        console.log('[useFaturas] Atualização de fatura concluída:', updatedFatura);
        // Forçar atualização após edição
        refetch();
        return updatedFatura; // Retornando a fatura atualizada
      } catch (error) {
        console.error('[useFaturas] Erro ao atualizar fatura:', error);
        throw error;
      }
    }
  };
};
