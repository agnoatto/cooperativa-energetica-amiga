
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

  console.log("useFaturas hook - faturas:", faturas);
  console.log("useFaturas hook - isLoading:", isLoading);

  return {
    faturas,
    isLoading,
    updateFatura: updateFaturaMutation.mutate,
    isUpdating: updateFaturaMutation.isPending,
    gerarFaturas: () => gerarFaturasMutation.mutate(),
    isGenerating: gerarFaturasMutation.isPending,
    deleteFatura: (id: string) => deleteFaturaMutation.mutate(id),
    updateFaturaStatus: async (data: UpdateFaturaStatusInput) => {
      try {
        console.log('Iniciando atualização de status em useFaturas:', data);
        const result = await updateFaturaStatusMutation.mutateAsync(data);
        console.log('Resultado da atualização em useFaturas:', result);
      } catch (error) {
        console.error('Erro ao atualizar status em useFaturas:', error);
        throw error;
      }
    }
  };
};
