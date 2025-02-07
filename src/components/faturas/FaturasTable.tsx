
import { Table, TableBody } from "@/components/ui/table";
import { TableHeader } from "./TableHeader";
import { TableRow } from "./TableRow";
import { EmptyState } from "./EmptyState";
import { LoadingState } from "./LoadingState";
import type { Fatura } from "@/types/fatura";

interface FaturasTableProps {
  faturas: Fatura[] | undefined;
  isLoading: boolean;
  onEditFatura: (fatura: Fatura) => void;
}

export function FaturasTable({ faturas, isLoading, onEditFatura }: FaturasTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader />
        <TableBody>
          {isLoading ? (
            <LoadingState />
          ) : faturas && faturas.length > 0 ? (
            faturas.map((fatura) => (
              <TableRow 
                key={fatura.id} 
                fatura={fatura} 
                onEditFatura={onEditFatura}
              />
            ))
          ) : (
            <EmptyState />
          )}
        </TableBody>
      </Table>
    </div>
  );
}
