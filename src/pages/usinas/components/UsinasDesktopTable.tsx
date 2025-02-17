
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { formatarMoeda } from "@/utils/formatters";
import { UsinaData } from "../types";

interface UsinasDesktopTableProps {
  usinas: UsinaData[] | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function UsinasDesktopTable({ usinas, onEdit, onDelete }: UsinasDesktopTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Investidor</TableHead>
            <TableHead>Unidade</TableHead>
            <TableHead>Valor do kWh</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usinas?.map((usina) => (
            <TableRow key={usina.id}>
              <TableCell>{usina.investidor?.nome_investidor}</TableCell>
              <TableCell>{usina.unidade?.numero_uc}</TableCell>
              <TableCell>{formatarMoeda(usina.valor_kwh)}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => onEdit(usina.id)}
                  className="h-8 w-8"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => onDelete(usina.id)}
                  className="h-8 w-8"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {(!usinas || usinas.length === 0) && (
            <TableRow>
              <TableCell colSpan={4} className="text-center h-24">
                Nenhuma usina encontrada
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
