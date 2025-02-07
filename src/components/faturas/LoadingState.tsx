
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";

export function LoadingState() {
  return (
    <TableRow>
      <TableCell colSpan={10} className="text-center">
        Carregando...
      </TableCell>
    </TableRow>
  );
}
