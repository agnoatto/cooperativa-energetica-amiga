
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { InvestidorForm } from "@/components/investidores/InvestidorForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { InvestidoresTable } from "@/components/investidores/InvestidoresTable";
import { toast } from "sonner";

const Investidores = () => {
  const [selectedInvestidorId, setSelectedInvestidorId] = useState<
    string | undefined
  >();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: investidores, refetch } = useQuery({
    queryKey: ["investidores", searchTerm],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investidores")
        .select("*")
        .is("deleted_at", null)
        .ilike("nome_investidor", `%${searchTerm}%`)
        .order("nome_investidor");

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
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", investidorId);

      if (error) {
        throw error;
      }

      toast.success("Investidor excluído com sucesso!");
      await refetch();
    } catch (error) {
      console.error("Erro ao excluir investidor:", error);
      toast.error("Erro ao excluir investidor");
    }
  };

  const handleFormClose = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      setSelectedInvestidorId(undefined);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Investidores</h1>
        <Button
          onClick={() => {
            setSelectedInvestidorId(undefined);
            setIsFormOpen(true);
          }}
          className="w-full sm:w-auto"
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
          className="pl-8 w-full"
        />
      </div>

      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="min-w-full inline-block align-middle">
          <InvestidoresTable
            investidores={investidores || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <InvestidorForm
        open={isFormOpen}
        onOpenChange={handleFormClose}
        investidorId={selectedInvestidorId}
        onSuccess={refetch}
      />
    </div>
  );
};

export default Investidores;
