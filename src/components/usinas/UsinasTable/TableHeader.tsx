
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function UsinasTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Investidor</TableHead>
        <TableHead>Unidade</TableHead>
        <TableHead>Valor do kWh</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="text-right">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
}
