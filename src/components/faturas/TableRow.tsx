
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TableCell,
  TableRow as UITableRow,
} from "@/components/ui/table";
import { FaturaPdfButton } from "./FaturaPdfButton";
import type { Fatura } from "@/types/fatura";

interface TableRowProps {
  fatura: Fatura;
  onEditFatura: (fatura: Fatura) => void;
}

export function TableRow({ fatura, onEditFatura }: TableRowProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const calcularValorAssinatura = (fatura: Fatura) => {
    const baseDesconto = fatura.total_fatura - fatura.iluminacao_publica - fatura.outros_valores;
    const valorAposDesconto = baseDesconto - fatura.valor_desconto;
    return valorAposDesconto - fatura.fatura_concessionaria;
  };

  return (
    <UITableRow>
      <TableCell>{fatura.unidade_beneficiaria.cooperado.nome}</TableCell>
      <TableCell>
        {fatura.unidade_beneficiaria.numero_uc}
        {fatura.unidade_beneficiaria.apelido && (
          <span className="text-gray-500 text-sm ml-1">
            ({fatura.unidade_beneficiaria.apelido})
          </span>
        )}
      </TableCell>
      <TableCell>{fatura.consumo_kwh} kWh</TableCell>
      <TableCell>{formatCurrency(fatura.total_fatura)}</TableCell>
      <TableCell>{formatCurrency(fatura.fatura_concessionaria)}</TableCell>
      <TableCell>{fatura.unidade_beneficiaria.percentual_desconto}%</TableCell>
      <TableCell>{formatCurrency(fatura.valor_desconto)}</TableCell>
      <TableCell>{formatCurrency(calcularValorAssinatura(fatura))}</TableCell>
      <TableCell>
        <span className={`px-2 py-1 rounded-full text-sm ${
          fatura.status === 'pendente'
            ? 'bg-yellow-100 text-yellow-800'
            : fatura.status === 'paga'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {fatura.status.charAt(0).toUpperCase() + fatura.status.slice(1)}
        </span>
      </TableCell>
      <TableCell className="text-right space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onEditFatura(fatura)}
          title="Editar Fatura"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <FaturaPdfButton fatura={fatura} />
      </TableCell>
    </UITableRow>
  );
}
