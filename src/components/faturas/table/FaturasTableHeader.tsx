
import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function FaturasTableHeader() {
  return (
    <TableHeader className="bg-gray-100 sticky top-0">
      <TableRow className="hover:bg-gray-100">
        <TableHead className="font-semibold text-gray-700">Informações do Cooperado</TableHead>
        <TableHead className="font-semibold text-gray-700">Data Vencimento</TableHead>
        <TableHead className="font-semibold text-gray-700 text-right">Consumo (kWh)</TableHead>
        <TableHead className="font-semibold text-gray-700 text-right">Valor Original</TableHead>
        <TableHead className="font-semibold text-gray-700 text-right">Conta de Energia</TableHead>
        <TableHead className="font-semibold text-gray-700 text-right">Desconto (%)</TableHead>
        <TableHead className="font-semibold text-gray-700 text-right">Valor Desconto</TableHead>
        <TableHead className="font-semibold text-gray-700 text-right">Valor da Assinatura</TableHead>
        <TableHead className="font-semibold text-gray-700">Status</TableHead>
        <TableHead className="font-semibold text-gray-700">Conta</TableHead>
        <TableHead className="font-semibold text-gray-700 text-right">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
}
