
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { InvestidorForm } from "@/components/investidores/InvestidorForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { DeleteInvestidorDialog } from "@/components/investidores/DeleteInvestidorDialog";

const Investidores = () => {
  const [selectedInvestidorId, setSelectedInvestidorId] = useState<string | undefined>();
  const [selectedInvestidorName, setSelectedInvestidorName] = useState<string>("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: investidores, refetch } = useQuery({
    queryKey: ["investidores"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investidores")
        .select("*")
        .is("deleted_at", null)
        .ilike("nome_investidor", `%${searchTerm}%`);
      
      if (error) throw error;
      return data;
    },
  });

  const handleEdit = (investidorId: string) => {
    setSelectedInvestidorId(investidorId);
    setIsFormOpen(true);
  };

  const handleDelete = (investidorId: string, nome_investidor: string) => {
    setSelectedInvestidorId(investidorId);
    setSelectedInvestidorName(nome_investidor);
    setIsDeleteDialogOpen(true);
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

      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar investidores..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
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
                    size="sm"
                    onClick={() => handleEdit(investidor.id)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(investidor.id, investidor.nome_investidor)}
                  >
                    Excluir
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

      {selectedInvestidorId && (
        <DeleteInvestidorDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          investidorId={selectedInvestidorId}
          investidorName={selectedInvestidorName}
          onSuccess={refetch}
        />
      )}
    </div>
  );
};

export default Investidores;
