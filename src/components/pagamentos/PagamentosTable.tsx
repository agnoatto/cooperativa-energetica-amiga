
import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PagamentoTableRow } from "./table/PagamentoTableRow";
import { PagamentosLoadingState } from "./table/PagamentosLoadingState";
import { PagamentosEmptyState } from "./table/PagamentosEmptyState";
import { PagamentoData } from "./types/pagamento";

interface PagamentosTableProps {
  pagamentos?: PagamentoData[];
  isLoading: boolean;
  onEditPagamento: (pagamento: PagamentoData) => void;
  onViewDetails: (pagamento: PagamentoData) => void;
  onDeletePagamento: (pagamento: PagamentoData) => void;
}

export function PagamentosTable({
  pagamentos,
  isLoading,
  onEditPagamento,
  onViewDetails,
  onDeletePagamento,
}: PagamentosTableProps) {
  if (isLoading) {
    return <PagamentosLoadingState />;
  }

  if (!pagamentos?.length) {
    return <PagamentosEmptyState />;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>UC</TableHead>
            <TableHead>Investidor</TableHead>
            <TableHead className="text-right">Geração (kWh)</TableHead>
            <TableHead className="text-right">Valor Concess.</TableHead>
            <TableHead className="text-right">Valor Total</TableHead>
            <TableHead className="text-right">Status</TableHead>
            <TableHead className="text-center">Conta</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pagamentos.map((pagamento) => (
            <PagamentoTableRow
              key={pagamento.id}
              pagamento={pagamento}
              onEdit={onEditPagamento}
              onDelete={onDeletePagamento}
              onViewDetails={onViewDetails}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
