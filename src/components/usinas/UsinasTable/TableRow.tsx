
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TableActions } from "./TableActions";
import { formatCurrency } from "@/utils/formatters";

interface UsinasTableRowProps {
  usina: {
    id: string;
    investidor: { nome_investidor: string } | null;
    unidade: { numero_uc: string } | null;
    valor_kwh: number;
    status: string;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string, nome: string) => void;
}

export function UsinasTableRow({ usina, onEdit, onDelete }: UsinasTableRowProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <TableRow>
      <TableCell>{usina.investidor?.nome_investidor}</TableCell>
      <TableCell>{usina.unidade?.numero_uc}</TableCell>
      <TableCell>{formatCurrency(usina.valor_kwh)}</TableCell>
      <TableCell>
        <Badge className={getStatusColor(usina.status)}>
          {usina.status.charAt(0).toUpperCase() + usina.status.slice(1)}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <TableActions
          onEdit={() => onEdit(usina.id)}
          onDelete={() => onDelete(usina.id, usina.investidor?.nome_investidor || '')}
        />
      </TableCell>
    </TableRow>
  );
}
