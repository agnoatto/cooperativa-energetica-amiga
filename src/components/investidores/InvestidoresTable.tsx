
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash } from "lucide-react";
import { formatarDocumento, formatarTelefone } from "@/utils/formatters";
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
import { useState } from "react";
import { toast } from "sonner";

interface Investidor {
  id: string;
  nome_investidor: string;
  documento: string;
  telefone: string | null;
  email: string | null;
}

interface InvestidoresTableProps {
  investidores: Investidor[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
}

export function InvestidoresTable({
  investidores,
  onEdit,
  onDelete,
}: InvestidoresTableProps) {
  const [investidorToDelete, setInvestidorToDelete] = useState<Investidor | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!investidorToDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(investidorToDelete.id);
      toast.success("Investidor excluído com sucesso");
    } catch (error) {
      toast.error("Erro ao excluir investidor");
    } finally {
      setIsDeleting(false);
      setInvestidorToDelete(null);
    }
  };

  return (
    <>
      <div className="rounded-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full border-collapse [&_tr:hover]:bg-gray-50">
            <TableHeader className="[&_tr]:h-8 [&_th]:p-2 [&_th]:border-x [&_th]:border-gray-200 [&_tr]:border-b [&_tr]:border-gray-200">
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="[&_tr]:h-8 [&_td]:p-2 [&_td]:border-x [&_td]:border-gray-200 [&_tr]:border-b [&_tr]:border-gray-200">
              {investidores.map((investidor) => (
                <TableRow key={investidor.id}>
                  <TableCell className="whitespace-nowrap">
                    {investidor.nome_investidor}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatarDocumento(investidor.documento)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatarTelefone(investidor.telefone || "")}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {investidor.email || "-"}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(investidor.id)}
                      className="h-6 w-6"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setInvestidorToDelete(investidor)}
                      className="h-6 w-6"
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog
        open={!!investidorToDelete}
        onOpenChange={() => setInvestidorToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o investidor{" "}
              {investidorToDelete?.nome_investidor}? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
