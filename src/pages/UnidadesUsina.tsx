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

const UnidadesUsina = () => {
  const [selectedUnidadeId, setSelectedUnidadeId] = useState<string | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: unidades, refetch } = useQuery({
    queryKey: ["unidades_usina"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("unidades_usina")
        .select(`
          *,
          cooperado:cooperados(nome),
          investidor:investidores(nome)
        `);
      if (error) throw error;
      return data;
    },
  });

  const handleEdit = (unidadeId: string) => {
    setSelectedUnidadeId(unidadeId);
    setIsFormOpen(true);
  };

  const handleDelete = async (unidadeId: string) => {
    try {
      const { error } = await supabase
        .from("unidades_usina")
        .delete()
        .eq("id", unidadeId);

      if (error) throw error;
      refetch();
    } catch (error: any) {
      console.error("Error deleting unidade:", error);
    }
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
              <TableHead>Tipo Titular</TableHead>
              <TableHead>Titular</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {unidades?.map((unidade) => (
              <TableRow key={unidade.id}>
                <TableCell>{unidade.numero_uc}</TableCell>
                <TableCell>{unidade.endereco}</TableCell>
                <TableCell>{unidade.titular_tipo}</TableCell>
                <TableCell>
                  {unidade.titular_tipo === "cooperado"
                    ? unidade.cooperado?.nome
                    : unidade.investidor?.nome}
                </TableCell>
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