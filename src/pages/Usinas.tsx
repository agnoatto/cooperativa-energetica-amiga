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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UsinaForm } from "@/components/usinas/UsinaForm";
import { useState } from "react";

const Usinas = () => {
  const [openForm, setOpenForm] = useState(false);
  const [selectedUsinaId, setSelectedUsinaId] = useState<string | undefined>();

  const { data: usinas, refetch } = useQuery({
    queryKey: ['usinas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('usinas')
        .select(`
          *,
          investidor:investidores(nome_investidor),
          unidade:unidades_usina(numero_uc)
        `);

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (usinaId: string) => {
    try {
      const { error } = await supabase
        .from('usinas')
        .delete()
        .eq('id', usinaId);

      if (error) throw error;
      refetch();
    } catch (error: any) {
      console.error('Error deleting usina:', error);
    }
  };

  const handleEdit = (usinaId: string) => {
    setSelectedUsinaId(usinaId);
    setOpenForm(true);
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
          <TableHeader>
            <TableRow>
              <TableHead>Investidor</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Valor do kWh</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usinas?.map((usina) => (
              <TableRow key={usina.id}>
                <TableCell>{usina.investidor?.nome_investidor}</TableCell>
                <TableCell>{usina.unidade?.numero_uc}</TableCell>
                <TableCell>R$ {usina.valor_kwh}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleEdit(usina.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleDelete(usina.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
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