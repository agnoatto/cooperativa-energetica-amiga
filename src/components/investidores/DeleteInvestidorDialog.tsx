
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

interface DeleteInvestidorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investidorId: string;
  investidorName: string;
  onSuccess: () => void;
}

export function DeleteInvestidorDialog({
  open,
  onOpenChange,
  investidorId,
  investidorName,
  onSuccess,
}: DeleteInvestidorDialogProps) {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("investidores")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", investidorId);

      if (error) throw error;

      toast({
        title: "Investidor excluído com sucesso!",
      });
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error deleting investidor:", error);
      toast({
        title: "Erro ao excluir investidor",
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
            Esta ação não pode ser desfeita. Isso excluirá permanentemente o
            investidor {investidorName}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
