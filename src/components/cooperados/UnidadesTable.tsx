
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

interface UnidadesTableProps {
  unidades: any[];
  onEdit: (cooperadoId: string, unidadeId: string) => void;
  onDelete: (unidadeId: string) => void;
}

export function UnidadesTable({
  unidades,
  onEdit,
  onDelete,
}: UnidadesTableProps) {
  return (
    <div className="rounded-md border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="w-full border-collapse [&_tr:hover]:bg-gray-50">
          <TableHeader className="[&_tr]:h-8 [&_th]:p-2 [&_th]:border-x [&_th]:border-gray-200 [&_tr]:border-b [&_tr]:border-gray-200">
            <TableRow>
              <TableHead>Número UC</TableHead>
              <TableHead>Apelido</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead>Desconto</TableHead>
              <TableHead>Data Entrada</TableHead>
              <TableHead>Data Saída</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr]:h-8 [&_td]:p-2 [&_td]:border-x [&_td]:border-gray-200 [&_tr]:border-b [&_tr]:border-gray-200">
            {unidades.map((unidade) => (
              <TableRow key={unidade.id}>
                <TableCell className="whitespace-nowrap">{unidade.numero_uc}</TableCell>
                <TableCell className="whitespace-nowrap">{unidade.apelido}</TableCell>
                <TableCell className="whitespace-nowrap">{unidade.endereco}</TableCell>
                <TableCell className="whitespace-nowrap">{unidade.percentual_desconto}%</TableCell>
                <TableCell className="whitespace-nowrap">
                  {new Date(unidade.data_entrada).toLocaleDateString()}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {unidade.data_saida 
                    ? new Date(unidade.data_saida).toLocaleDateString()
                    : '-'}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => onEdit(unidade.cooperado_id, unidade.id)}
                    className="h-6 w-6"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => onDelete(unidade.id)}
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
  );
}
