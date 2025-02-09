
import { Button } from "@/components/ui/button";
import { Table, TableBody } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UsinaForm } from "@/components/usinas/UsinaForm";
import { useState } from "react";
import { UsinasTableHeader } from "@/components/usinas/UsinasTable/TableHeader";
import { UsinasTableRow } from "@/components/usinas/UsinasTable/TableRow";
import { useToast } from "@/hooks/use-toast";

const Usinas = () => {
  const [openForm, setOpenForm] = useState(false);
  const [selectedUsinaId, setSelectedUsinaId] = useState<string | undefined>();
  const { toast } = useToast();

  const { data: usinas, refetch } = useQuery({
    queryKey: ['usinas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('usinas')
        .select(`
          *,
          investidor:investidores(nome_investidor),
          unidade:unidades_usina(numero_uc)
        `)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleEdit = (usinaId: string) => {
    setSelectedUsinaId(usinaId);
    setOpenForm(true);
  };

  const handleDelete = async (usinaId: string, nome: string) => {
    try {
      const { data: hasPagamentos } = await supabase
        .from('pagamentos_usina')
        .select('id')
        .eq('usina_id', usinaId)
        .limit(1);

      if (hasPagamentos && hasPagamentos.length > 0) {
        toast({
          title: "Não é possível excluir esta usina",
          description: "Existem pagamentos associados a esta usina.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("usinas")
        .update({ deleted_at: new Date().toISOString(), status: 'inactive' })
        .eq("id", usinaId);

      if (error) throw error;

      toast({
        title: "Usina excluída com sucesso!",
      });
      refetch();
    } catch (error: any) {
      console.error("Error deleting usina:", error);
      toast({
        title: "Erro ao excluir usina",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSuccess = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Usinas</h1>
        <Button onClick={() => {
          setSelectedUsinaId(undefined);
          setOpenForm(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Usina
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <UsinasTableHeader />
          <TableBody>
            {usinas?.map((usina) => (
              <UsinasTableRow
                key={usina.id}
                usina={usina}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <UsinaForm
        open={openForm}
        onOpenChange={setOpenForm}
        usinaId={selectedUsinaId}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

export default Usinas;
