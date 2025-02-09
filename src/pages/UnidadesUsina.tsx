
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash } from "lucide-react";
import { useState } from "react";
import { UnidadeUsinaForm } from "@/components/unidades-usina/UnidadeUsinaForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const UnidadesUsina = () => {
  const [selectedUnidadeId, setSelectedUnidadeId] = useState<string | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const { data: unidades, refetch } = useQuery({
    queryKey: ["unidades_usina"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("unidades_usina")
        .select(`
          *,
          titular:investidores(nome_investidor),
          usinas:usinas(id)
        `);

      if (error) {
        console.error("Error fetching unidades:", error);
        toast({
          title: "Erro ao carregar unidades",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      return data;
    },
  });

  const handleEdit = (unidadeId: string) => {
    setSelectedUnidadeId(unidadeId);
    setIsFormOpen(true);
  };

  const handleDelete = async (unidadeId: string) => {
    try {
      // First check if the unidade has any associated usinas
      const { data: associatedUsinas, error: checkError } = await supabase
        .from('usinas')
        .select('id')
        .eq('unidade_usina_id', unidadeId);

      if (checkError) throw checkError;
      
      if (associatedUsinas && associatedUsinas.length > 0) {
        toast({
          title: "Não é possível excluir esta unidade",
          description: "Existem usinas associadas a esta unidade. Por favor, exclua as usinas primeiro.",
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
      
      refetch();
    } catch (error: any) {
      console.error("Error deleting unidade:", error);
      toast({
        title: "Erro ao excluir unidade",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatAddress = (unidade: any) => {
    const parts = [
      unidade.logradouro,
      unidade.numero,
      unidade.complemento,
      unidade.cidade,
      unidade.uf,
      unidade.cep,
    ].filter(Boolean);
    return parts.join(", ");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Unidades da Usina</h1>
        <Button
          onClick={() => {
            setSelectedUnidadeId(undefined);
            setIsFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Nova Unidade
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número UC</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead>Titular</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {unidades?.map((unidade) => (
              <TableRow key={unidade.id}>
                <TableCell>{unidade.numero_uc}</TableCell>
                <TableCell>{formatAddress(unidade)}</TableCell>
                <TableCell>{unidade.titular?.nome_investidor}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(unidade.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(unidade.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <UnidadeUsinaForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        unidadeId={selectedUnidadeId}
        onSuccess={refetch}
      />
    </div>
  );
};

export default UnidadesUsina;
