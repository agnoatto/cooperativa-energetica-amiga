
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

  // Componente para visualização em dispositivos móveis
  const MobileCard = ({ investidor }: { investidor: Investidor }) => (
    <div className="bg-white p-4 rounded-lg border shadow-sm mb-4">
      <div className="flex justify-between items-start mb-2">
        <div className="font-medium">{investidor.nome_investidor}</div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(investidor.id)}
            className="h-8 w-8"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setInvestidorToDelete(investidor)}
            className="h-8 w-8"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="space-y-1 text-sm text-gray-500">
        <p>CPF/CNPJ: {formatarDocumento(investidor.documento)}</p>
        <p>Telefone: {investidor.telefone ? formatarTelefone(investidor.telefone) : "-"}</p>
        <p>Email: {investidor.email || "-"}</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Versão Mobile */}
      <div className="md:hidden">
        {investidores.map((investidor) => (
          <MobileCard key={investidor.id} investidor={investidor} />
        ))}
        {investidores.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            Nenhum investidor encontrado
          </div>
        )}
      </div>

      {/* Versão Desktop */}
      <div className="hidden md:block rounded-md border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CPF/CNPJ</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investidores.map((investidor) => (
              <TableRow key={investidor.id}>
                <TableCell className="font-medium">
                  {investidor.nome_investidor}
                </TableCell>
                <TableCell>{formatarDocumento(investidor.documento)}</TableCell>
                <TableCell>
                  {investidor.telefone ? formatarTelefone(investidor.telefone) : "-"}
                </TableCell>
                <TableCell>{investidor.email || "-"}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(investidor.id)}
                    className="h-8 w-8"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setInvestidorToDelete(investidor)}
                    className="h-8 w-8"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {investidores.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  Nenhum investidor encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
