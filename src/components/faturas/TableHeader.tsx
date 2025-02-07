
import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Cooperado</TableHead>
        <TableHead>UC</TableHead>
        <TableHead>Consumo (kWh)</TableHead>
        <TableHead>Valor Original</TableHead>
        <TableHead>Conta de Energia</TableHead>
        <TableHead>Desconto (%)</TableHead>
        <TableHead>Valor Desconto</TableHead>
        <TableHead>Valor da Assinatura</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="text-right">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
}
