
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
import { useIsMobile } from "@/hooks/use-mobile";
import { formatarMoeda } from "@/utils/formatters";

const Usinas = () => {
  const [openForm, setOpenForm] = useState(false);
  const [selectedUsinaId, setSelectedUsinaId] = useState<string | undefined>();
  const isMobile = useIsMobile();

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

  if (isMobile) {
    return (
      <div className="space-y-6 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Usinas</h1>
          <Button 
            onClick={() => {
              setSelectedUsinaId(undefined);
              setOpenForm(true);
            }}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>

        <div className="space-y-4">
          {usinas?.map((usina) => (
            <div
              key={usina.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">
                    UC: {usina.unidade?.numero_uc}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {usina.investidor?.nome_investidor}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-gray-500">Valor do kWh:</span>
                  <span>{formatarMoeda(usina.valor_kwh)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(usina.id)}
                  className="h-10 w-10 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(usina.id)}
                  className="h-10 w-10 p-0"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {(!usinas || usinas.length === 0) && (
            <div className="text-center py-8 px-4 border rounded-lg">
              <p className="text-gray-500">Nenhuma usina encontrada</p>
            </div>
          )}
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
                <TableCell>{formatarMoeda(usina.valor_kwh)}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleEdit(usina.id)}
                    className="h-8 w-8"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleDelete(usina.id)}
                    className="h-8 w-8"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {(!usinas || usinas.length === 0) && (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  Nenhuma usina encontrada
                </TableCell>
              </TableRow>
            )}
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
