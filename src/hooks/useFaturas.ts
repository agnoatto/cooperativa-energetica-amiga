
import { useUpdateFatura } from "./faturas/useUpdateFatura";
import { useDeleteFatura } from "./faturas/useDeleteFatura";
import { useGerarFaturas } from "./faturas/useGerarFaturas";
import { useFetchFaturas } from "./faturas/useFetchFaturas";
import { useUpdateFaturaStatus } from "./faturas/useUpdateFaturaStatus";
import type { UseFaturasResult, UpdateFaturaStatusInput } from "./faturas/types";

export const useFaturas = (currentDate: Date): UseFaturasResult => {
  const { data: faturas, isLoading } = useFetchFaturas(currentDate);
  const updateFaturaMutation = useUpdateFatura();
  const deleteFaturaMutation = useDeleteFatura();
  const gerarFaturasMutation = useGerarFaturas(currentDate);
  const updateFaturaStatusMutation = useUpdateFaturaStatus();

  console.log("[useFaturas] hook - faturas:", faturas?.length || 0, "itens");
  console.log("[useFaturas] hook - isLoading:", isLoading);

  return {
    faturas,
    isLoading,
    updateFatura: async (data) => {
      console.log("[useFaturas] Chamando updateFatura com dados:", data);
      try {
        const result = await updateFaturaMutation.mutateAsync(data);
        console.log("[useFaturas] updateFatura concluído com sucesso:", result);
        // Não retornamos o resultado, apenas completamos a promise
        // para atender ao tipo Promise<void> definido na interface
      } catch (error) {
        console.error("[useFaturas] Erro em updateFatura:", error);
        throw error;
      }
    },
    isUpdating: updateFaturaMutation.isPending,
    gerarFaturas: () => gerarFaturasMutation.mutate(),
    isGenerating: gerarFaturasMutation.isPending,
    deleteFatura: (id: string) => deleteFaturaMutation.mutate(id),
    updateFaturaStatus: async (data: UpdateFaturaStatusInput) => {
      try {
        console.log('[useFaturas] Iniciando atualização de status:', data);
        const result = await updateFaturaStatusMutation.mutateAsync(data);
        console.log('[useFaturas] Resultado da atualização de status:', result);
      } catch (error) {
        console.error('[useFaturas] Erro ao atualizar status:', error);
        throw error;
      }
    }
  };
};
