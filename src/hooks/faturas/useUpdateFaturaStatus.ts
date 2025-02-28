
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UpdateFaturaStatusInput } from "./types";
import { updateFaturaStatus } from "./services/updateFaturaService";
import { statusMessages } from "./utils/statusMessages";

export const useUpdateFaturaStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateFaturaStatusInput) => {
      console.log('[useUpdateFaturaStatus] Atualizando status para:', data);
      try {
        const result = await updateFaturaStatus(data);
        console.log('[useUpdateFaturaStatus] Status atualizado com sucesso:', result);
        return result;
      } catch (error) {
        console.error('[useUpdateFaturaStatus] Erro ao atualizar status:', error);
        throw error;
      }
    },
    onSuccess: async (_, variables) => {
      try {
        console.log('[useUpdateFaturaStatus] Sucesso na atualização, invalidando cache...');
        const date = new Date();
        queryClient.invalidateQueries({ 
          queryKey: ['faturas', date.getMonth() + 1, date.getFullYear()]
        });
        
        toast.success(statusMessages[variables.status] || "Status da fatura atualizado com sucesso!");
        console.log('[useUpdateFaturaStatus] Cache invalidado e notificação exibida');
      } catch (error) {
        console.error('[useUpdateFaturaStatus] Erro ao invalidar cache:', error);
      }
    },
    onError: (error) => {
      console.error('[useUpdateFaturaStatus] Erro na mutação:', error);
      toast.error(`Erro ao atualizar status: ${error.message || 'Erro desconhecido'}`);
    }
  });
};
