
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface DeleteUsinaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usinaId: string;
  usinaName: string;
  onSuccess: () => void;
}

export function DeleteUsinaDialog({
  open,
  onOpenChange,
  usinaId,
  usinaName,
  onSuccess,
}: DeleteUsinaDialogProps) {
  const { toast } = useToast();

  const { data: hasPagamentos, isLoading } = useQuery({
    queryKey: ['usina-pagamentos', usinaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pagamentos_usina')
        .select('id')
        .eq('usina_id', usinaId)
        .limit(1);

      if (error) throw error;
      return data && data.length > 0;
    },
    enabled: open,
  });

  const handleDelete = async () => {
    try {
      if (hasPagamentos) {
        toast({
          title: "Não é possível excluir esta usina",
          description: "Existem pagamentos associados a esta usina.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("usinas")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", usinaId);

      if (error) throw error;

      toast({
        title: "Usina excluída com sucesso!",
      });
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error deleting usina:", error);
      toast({
        title: "Erro ao excluir usina",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            {hasPagamentos 
              ? "Não é possível excluir esta usina pois existem pagamentos associados."
              : `Esta ação não pode ser desfeita. Isso excluirá permanentemente a usina ${usinaName}.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
            disabled={hasPagamentos || isLoading}
          >
            {isLoading ? "Verificando..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
