
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UpdateFaturaStatusInput } from "./types";
import { updateFaturaStatus } from "./services/updateFaturaService";
import { statusMessages } from "./utils/statusMessages";

export const useUpdateFaturaStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFaturaStatus,
    onSuccess: (_, variables) => {
      const date = new Date();
      queryClient.invalidateQueries({ 
        queryKey: ['faturas', date.getMonth() + 1, date.getFullYear()]
      });
      
      toast.success(statusMessages[variables.status] || "Status da fatura atualizado com sucesso!");
    }
  });
};
