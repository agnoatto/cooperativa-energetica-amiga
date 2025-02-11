
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Trash } from "lucide-react";
import type { UnidadeUsina } from "./types";
import { formatAddress } from "./utils/formatAddress";

interface UnidadesUsinaTableProps {
  unidades?: UnidadeUsina[];
  isLoading: boolean;
  onEdit: (unidadeId: string) => void;
  onDelete: (unidadeId: string) => void;
}

export function UnidadesUsinaTable({
  unidades,
  isLoading,
  onEdit,
  onDelete,
}: UnidadesUsinaTableProps) {
  return (
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
                    onClick={() => onEdit(unidade.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDelete(unidade.id)}
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
  );
}
