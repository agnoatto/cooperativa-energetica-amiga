
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
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
        <TableBody>
          {unidades.map((unidade) => (
            <TableRow key={unidade.id}>
              <TableCell>{unidade.numero_uc}</TableCell>
              <TableCell>{unidade.apelido}</TableCell>
              <TableCell>{unidade.endereco}</TableCell>
              <TableCell>{unidade.percentual_desconto}%</TableCell>
              <TableCell>{new Date(unidade.data_entrada).toLocaleDateString()}</TableCell>
              <TableCell>
                {unidade.data_saida 
                  ? new Date(unidade.data_saida).toLocaleDateString()
                  : '-'}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => onEdit(unidade.cooperado_id, unidade.id)}
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
