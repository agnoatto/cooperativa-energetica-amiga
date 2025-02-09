
import { TableBody, TableCell, TableRow } from "@/components/ui/table";

export function FaturasLoadingState() {
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={10} className="text-center">
          Carregando...
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
