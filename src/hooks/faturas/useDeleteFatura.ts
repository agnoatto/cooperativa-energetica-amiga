
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { STORAGE_BUCKET } from "@/components/faturas/upload/constants";

export const useDeleteFatura = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Excluindo fatura:', id);
      
      // Primeiro, buscar informações do arquivo da fatura
      const { data: fatura } = await supabase
        .from('faturas')
        .select('arquivo_concessionaria_path')
        .eq('id', id)
        .single();

      // Se existe arquivo, remover do storage primeiro
      if (fatura?.arquivo_concessionaria_path) {
        const { error: storageError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .remove([fatura.arquivo_concessionaria_path]);

        if (storageError) {
          console.error('Erro ao remover arquivo:', storageError);
          throw new Error('Erro ao remover arquivo da fatura');
        }
      }

      // Agora chama a função de deletar fatura que vai remover os registros do banco
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
