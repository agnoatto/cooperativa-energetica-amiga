
import { TableBody, TableCell, TableRow } from "@/components/ui/table";

export function FaturasEmptyState() {
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={10} className="text-center text-gray-500">
          Nenhuma fatura encontrada para este mês
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
