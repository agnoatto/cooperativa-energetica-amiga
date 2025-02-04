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
import { InvestidorForm } from "@/components/investidores/InvestidorForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Investidores = () => {
  const [selectedInvestidorId, setSelectedInvestidorId] = useState<
    string | undefined
  >();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: investidores, refetch } = useQuery({
    queryKey: ["investidores"],
    queryFn: async () => {
      const { data, error } = await supabase.from("investidores").select("*");
      if (error) throw error;
      return data;
    },
  });

  const handleEdit = (investidorId: string) => {
    setSelectedInvestidorId(investidorId);
    setIsFormOpen(true);
  };

  const handleDelete = async (investidorId: string) => {
    try {
      const { error } = await supabase
        .from("investidores")
        .delete()
        .eq("id", investidorId);

      if (error) throw error;
      refetch();
    } catch (error: any) {
      console.error("Error deleting investidor:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Investidores</h1>
        <Button
          onClick={() => {
            setSelectedInvestidorId(undefined);
            setIsFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Investidor
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investidores?.map((investidor) => (
              <TableRow key={investidor.id}>
                <TableCell>{investidor.nome_investidor}</TableCell>
                <TableCell>{investidor.documento}</TableCell>
                <TableCell>{investidor.telefone}</TableCell>
                <TableCell>{investidor.email}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(investidor.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(investidor.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <InvestidorForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        investidorId={selectedInvestidorId}
        onSuccess={refetch}
      />
    </div>
  );
};

export default Investidores;