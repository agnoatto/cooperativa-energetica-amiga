
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useDeleteUnidadeUsina(onSuccess: () => void) {
  const { toast } = useToast();

  const handleDelete = async (unidadeId: string) => {
    try {
      const { data: associatedUsinas, error: checkError } = await supabase
        .from("usinas")
        .select("id")
        .eq("unidade_usina_id", unidadeId);

      if (checkError) throw checkError;

      if (associatedUsinas && associatedUsinas.length > 0) {
        toast({
          title: "Não é possível excluir esta unidade",
          description:
            "Existem usinas associadas a esta unidade. Por favor, exclua as usinas primeiro.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("unidades_usina")
        .delete()
        .eq("id", unidadeId);

      if (error) throw error;

      toast({
        title: "Unidade excluída com sucesso!",
      });

      onSuccess();
    } catch (error: any) {
      console.error("Error deleting unidade:", error);
      toast({
        title: "Erro ao excluir unidade",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return { handleDelete };
}
