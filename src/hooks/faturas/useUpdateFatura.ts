
/**
 * Hook para atualização de faturas
 * 
 * Este hook utiliza o React Query para gerenciar o estado de atualização de faturas,
 * incluindo o gerenciamento de cache após a atualização bem-sucedida.
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Fatura } from "@/types/fatura";
import { toast } from "sonner";
import { updateFatura } from "./services/updateFaturaService";
import { UpdateFaturaInput } from "./types/updateFatura";

export type { UpdateFaturaInput };

export const useUpdateFatura = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFatura,
    onSuccess: (updatedFatura: Fatura) => {
      const date = new Date();
      // Invalidar a consulta para forçar uma atualização dos dados
      queryClient.invalidateQueries({ 
        queryKey: ['faturas', date.getMonth() + 1, date.getFullYear()]
      });
      
      // Atualizar a fatura no cache diretamente para exibição imediata
      queryClient.setQueryData(
        ['faturas', date.getMonth() + 1, date.getFullYear()],
        (oldData: Fatura[] | undefined) => {
          if (!oldData) return undefined;
          return oldData.map(fatura => 
            fatura.id === updatedFatura.id ? { ...fatura, ...updatedFatura } : fatura
          );
        }
      );
      
      toast.success("Fatura atualizada com sucesso!");
    },
    onError: (error) => {
      console.error("[useUpdateFatura] Erro na mutação:", error);
      toast.error(`Erro ao atualizar fatura: ${error.message || "Erro desconhecido"}`);
    }
  });
};
