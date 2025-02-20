
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useDeleteFatura = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Excluindo fatura:', id);
      
      const { data, error } = await supabase
        .rpc('deletar_fatura', {
          p_fatura_id: id
        });

      if (error) {
        console.error('Erro ao excluir fatura:', error);
        throw new Error(error.message);
      }

      return data;
    },
    onMutate: () => {
      toast.loading("Excluindo fatura...", { id: "delete-fatura" });
    },
    onSuccess: () => {
      console.log('Fatura excluída com sucesso');
      // Invalida todas as queries de faturas para garantir atualização
      queryClient.invalidateQueries({
        queryKey: ['faturas']
      });
      toast.success("Fatura excluída com sucesso!", { id: "delete-fatura" });
    },
    onError: (error: Error) => {
      console.error("Erro ao excluir fatura:", error);
      toast.error(
        `Erro ao excluir fatura: ${error.message}`, 
        { id: "delete-fatura" }
      );
    },
  });
};
