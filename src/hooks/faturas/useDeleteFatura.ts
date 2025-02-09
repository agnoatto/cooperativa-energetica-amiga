
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useDeleteFatura = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Excluindo fatura:', id);
      const { error } = await supabase
        .from("faturas")
        .delete()
        .eq("id", id);

      if (error) {
        console.error('Erro ao excluir fatura:', error);
        throw error;
      }
    },
    onMutate: () => {
      toast.loading("Excluindo fatura...");
    },
    onSuccess: () => {
      console.log('Fatura excluída com sucesso');
      const date = new Date();
      queryClient.invalidateQueries({
        queryKey: ['faturas', date.getMonth() + 1, date.getFullYear()]
      });
      toast.success("Fatura excluída com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao excluir fatura:", error);
      toast.error("Erro ao excluir fatura. Por favor, tente novamente.");
    },
  });
};
