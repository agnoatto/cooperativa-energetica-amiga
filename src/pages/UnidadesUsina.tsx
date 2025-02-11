
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
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
import type { UnidadeUsina } from "@/components/unidades-usina/types";

const UnidadesUsina = () => {
  const [selectedUnidadeId, setSelectedUnidadeId] = useState<string | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [unidadeToDelete, setUnidadeToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  // Optimized query to fetch all data in a single request
  const { data: unidades, refetch, isLoading, error } = useQuery({
    queryKey: ["unidades_usina"],
    queryFn: async () => {
      const { data: unidadesData, error: unidadesError } = await supabase
        .from("unidades_usina")
        .select(`
          *,
          cooperativa:cooperativas!inner(id, nome, documento),
          cooperado:cooperados!inner(id, nome)
        `)
        .order("created_at", { ascending: false });

      if (unidadesError) throw unidadesError;

      return unidadesData?.map((unidade) => ({
        ...unidade,
        titular_nome:
          unidade.titular_tipo === "cooperativa"
            ? unidade.cooperativa?.nome
            : unidade.cooperado?.nome,
      })) as UnidadeUsina[];
    },
  });

  const handleEdit = (unidadeId: string) => {
    setSelectedUnidadeId(unidadeId);
    setIsFormOpen(true);
  };

  const handleDelete = async (unidadeId: string) => {
    try {
      const { data: associatedUsinas, error: checkError } = await supabase
        .from("usinas")
        .select("id")
        .eq("unidade_usina_id", unidadeId);

      if (checkError) throw checkError;

      if (associatedUsinas && associatedUsinas.length > 0) {
        toast({
          title: "Não é possível excluir esta unidade",
          description:
            "Existem usinas associadas a esta unidade. Por favor, exclua as usinas primeiro.",
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
    } finally {
      setUnidadeToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const formatAddress = ({
    logradouro,
    numero,
    complemento,
    cidade,
    uf,
    cep,
  }: Partial<UnidadeUsina>) => {
    const parts = [
      logradouro,
      numero,
      complemento,
      cidade,
      uf,
      cep,
    ].filter(Boolean);
    return parts.join(", ");
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Erro ao carregar unidades: {(error as Error).message}
        </AlertDescription>
      </Alert>
    );
  }

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
              <TableHead>Tipo</TableHead>
              <TableHead>Titular</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </TableCell>
              </TableRow>
            ) : unidades?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Nenhuma unidade encontrada
                </TableCell>
              </TableRow>
            ) : (
              unidades?.map((unidade) => (
                <TableRow key={unidade.id}>
                  <TableCell>{unidade.numero_uc}</TableCell>
                  <TableCell>{formatAddress(unidade)}</TableCell>
                  <TableCell>
                    {unidade.titular_tipo === "cooperativa"
                      ? "Cooperativa"
                      : "Cooperado"}
                  </TableCell>
                  <TableCell>{unidade.titular_nome}</TableCell>
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
                      onClick={() => {
                        setUnidadeToDelete(unidade.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <UnidadeUsinaForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        unidadeId={selectedUnidadeId}
        onSuccess={refetch}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta unidade? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => unidadeToDelete && handleDelete(unidadeToDelete)}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UnidadesUsina;

