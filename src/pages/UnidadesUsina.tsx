
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { UnidadeUsinaForm } from "@/components/unidades-usina/UnidadeUsinaForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { useUnidadesUsinaQuery } from "@/components/unidades-usina/hooks/useUnidadesUsinaQuery";
import { useDeleteUnidadeUsina } from "@/components/unidades-usina/hooks/useDeleteUnidadeUsina";
import { UnidadesUsinaTable } from "@/components/unidades-usina/UnidadesUsinaTable";

const UnidadesUsina = () => {
  const [selectedUnidadeId, setSelectedUnidadeId] = useState<string | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [unidadeToDelete, setUnidadeToDelete] = useState<string | null>(null);

  const { data: unidades, refetch, isLoading, error } = useUnidadesUsinaQuery();
  const { handleDelete } = useDeleteUnidadeUsina(refetch);

  const handleEdit = (unidadeId: string) => {
    setSelectedUnidadeId(unidadeId);
    setIsFormOpen(true);
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

      <UnidadesUsinaTable
        unidades={unidades}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={(unidadeId) => {
          setUnidadeToDelete(unidadeId);
          setDeleteDialogOpen(true);
        }}
      />

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
