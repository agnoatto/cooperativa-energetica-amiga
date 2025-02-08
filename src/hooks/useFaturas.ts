
import { useUpdateFatura } from "./faturas/useUpdateFatura";
import { useDeleteFatura } from "./faturas/useDeleteFatura";
import { useGerarFaturas } from "./faturas/useGerarFaturas";
import { useFetchFaturas } from "./faturas/useFetchFaturas";
import type { UseFaturasResult } from "./faturas/types";

export const useFaturas = (currentDate: Date): UseFaturasResult => {
  const { data: faturas, isLoading } = useFetchFaturas(currentDate);
  const updateFaturaMutation = useUpdateFatura();
  const deleteFaturaMutation = useDeleteFatura();
  const gerarFaturasMutation = useGerarFaturas(currentDate);

  return {
    faturas,
    isLoading,
    updateFatura: updateFaturaMutation.mutate,
    isUpdating: updateFaturaMutation.isPending,
    gerarFaturas: () => gerarFaturasMutation.mutate(),
    isGenerating: gerarFaturasMutation.isPending,
    deleteFatura: (id: string) => deleteFaturaMutation.mutate(id),
  };
};
