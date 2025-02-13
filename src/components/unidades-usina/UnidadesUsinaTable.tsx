
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
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[140px] w-full rounded-lg" />
        <Skeleton className="h-[140px] w-full rounded-lg" />
        <Skeleton className="h-[140px] w-full rounded-lg" />
      </div>
    );
  }

  if (!unidades?.length) {
    return (
      <div className="text-center py-8 px-4 border rounded-lg">
        <p className="text-gray-500">Nenhuma unidade encontrada</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-4">
        {unidades.map((unidade) => (
          <div
            key={unidade.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-gray-900">UC: {unidade.numero_uc}</h3>
                <p className="text-sm text-gray-500">
                  {unidade.titular_tipo === "cooperativa" ? "Cooperativa" : "Cooperado"}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-1">
                <span className="text-gray-500">Titular:</span>
                <span className="truncate">{unidade.titular_nome}</span>
              </div>

              <div className="mt-2 pt-2 border-t border-gray-100">
                <p className="text-gray-600 text-sm line-clamp-2">
                  {formatAddress(unidade)}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(unidade.id)}
                className="h-10 w-10 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(unidade.id)}
                className="h-10 w-10 p-0"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  }

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
          {unidades.map((unidade) => (
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
                  className="h-8 w-8"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDelete(unidade.id)}
                  className="h-8 w-8"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
