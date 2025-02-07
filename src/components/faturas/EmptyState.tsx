
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";

export function EmptyState() {
  return (
    <TableRow>
      <TableCell colSpan={10} className="text-center text-gray-500">
        Nenhuma fatura encontrada para este mês
      </TableCell>
    </TableRow>
  );
}
