
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface Unit {
  id: string;
  numero_uc: string;
  apelido: string | null;
  endereco: string;
  percentual_desconto: number;
  data_entrada: string;
  data_saida: string | null;
}

interface UnitsTabContentProps {
  units: Unit[] | null;
  isLoading: boolean;
}

export function UnitsTabContent({ units, isLoading }: UnitsTabContentProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  if (!units || units.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-4">
        Nenhuma unidade beneficiária encontrada
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Número UC</TableHead>
          <TableHead>Apelido</TableHead>
          <TableHead>Endereço</TableHead>
          <TableHead>Desconto</TableHead>
          <TableHead>Data Entrada</TableHead>
          <TableHead>Data Saída</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {units.map((unit) => (
          <TableRow key={unit.id}>
            <TableCell>{unit.numero_uc}</TableCell>
            <TableCell>{unit.apelido || '-'}</TableCell>
            <TableCell>{unit.endereco}</TableCell>
            <TableCell>{unit.percentual_desconto}%</TableCell>
            <TableCell>
              {format(new Date(unit.data_entrada), 'dd/MM/yyyy')}
            </TableCell>
            <TableCell>
              {unit.data_saida
                ? format(new Date(unit.data_saida), 'dd/MM/yyyy')
                : '-'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
