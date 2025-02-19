
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import { PagamentoData } from "../types/pagamento";
import { formatCurrency } from "@/utils/formatters";
import { BoletimMedicaoButton } from "../BoletimMedicaoButton";

interface PagamentoTableRowProps {
  pagamento: PagamentoData;
  onEdit: (pagamento: PagamentoData) => void;
  onDelete: (pagamento: PagamentoData) => void;
  onViewDetails: (pagamento: PagamentoData) => void;
  getPagamentosUltimos12Meses: (pagamento: PagamentoData) => Promise<PagamentoData[]>;
}

export function PagamentoTableRow({
  pagamento,
  onEdit,
  onDelete,
  onViewDetails,
  getPagamentosUltimos12Meses,
}: PagamentoTableRowProps) {
  return (
    <TableRow>
      <TableCell>{pagamento.usina.unidade_usina.numero_uc}</TableCell>
      <TableCell>{pagamento.usina.investidor.nome_investidor}</TableCell>
      <TableCell className="text-right">
        {pagamento.geracao_kwh.toLocaleString('pt-BR')}
      </TableCell>
      <TableCell className="text-right">
        {formatCurrency(pagamento.valor_concessionaria)}
      </TableCell>
      <TableCell className="text-right">
        {formatCurrency(pagamento.valor_total)}
      </TableCell>
      <TableCell className="text-right">{pagamento.status}</TableCell>
      <TableCell className="text-right space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onViewDetails(pagamento)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onEdit(pagamento)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onDelete(pagamento)}
          className="hover:bg-destructive hover:text-destructive-foreground"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <BoletimMedicaoButton 
          pagamento={pagamento}
          getPagamentosUltimos12Meses={getPagamentosUltimos12Meses}
        />
      </TableCell>
    </TableRow>
  );
}
