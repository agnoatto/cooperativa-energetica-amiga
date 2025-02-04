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
import { UsinaForm } from "@/components/usinas/UsinaForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Usinas = () => {
  const [selectedUsinaId, setSelectedUsinaId] = useState<string | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: usinas, refetch } = useQuery({
    queryKey: ['usinas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('usinas')
        .select(`
          *,
          investidor:investidores(nome),
          unidade:unidades_usina(numero_uc)
        `);

      if (error) throw error;
      return data;
    },
  });

  const handleEdit = (usinaId: string) => {
    setSelectedUsinaId(usinaId);
    setIsFormOpen(true);
  };

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Usinas</h1>
        <Button onClick={() => {
          setSelectedUsinaId(undefined);
          setIsFormOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" /> Nova Usina
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
                <TableCell>{usina.investidor?.nome}</TableCell>
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
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        usinaId={selectedUsinaId}
        onSuccess={refetch}
      />
    </div>
  );
}

export default Usinas;