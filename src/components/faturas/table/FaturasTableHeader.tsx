
import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function FaturasTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Cooperado</TableHead>
        <TableHead>CPF/CNPJ</TableHead>
        <TableHead>UC</TableHead>
        <TableHead>Vencimento</TableHead>
        <TableHead>Consumo (kWh)</TableHead>
        <TableHead>Valor Original</TableHead>
        <TableHead>Valor Concessionária</TableHead>
        <TableHead>Valor Total</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Fatura Cogesol</TableHead>
        <TableHead>Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
}
