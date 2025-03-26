
/**
 * Componente de tabela para listagem de pagamentos de usinas
 * 
 * Esta tabela exibe todos os pagamentos com informações como unidade consumidora,
 * investidor, valores e opções de ações como visualizar detalhes e editar.
 */
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
    <div className="rounded-md border border-gray-200 w-full overflow-hidden">
      <div className="w-full overflow-x-auto">
        <Table className="w-full min-w-[900px] [&_th]:bg-gray-50 [&_th]:font-medium [&_th]:text-gray-700 [&_th]:h-9 [&_tr]:border-b [&_tr]:border-gray-200">
          <TableHeader className="[&_tr]:border-b [&_tr]:border-gray-200">
            <TableRow className="h-9">
              <TableHead className="py-1.5 px-3 text-sm whitespace-nowrap">UC</TableHead>
              <TableHead className="py-1.5 px-3 text-sm whitespace-nowrap">Investidor</TableHead>
              <TableHead className="py-1.5 px-3 text-sm text-right whitespace-nowrap">Geração (kWh)</TableHead>
              <TableHead className="py-1.5 px-3 text-sm text-right whitespace-nowrap">Valor Concess.</TableHead>
              <TableHead className="py-1.5 px-3 text-sm text-right whitespace-nowrap">Valor Total</TableHead>
              <TableHead className="py-1.5 px-3 text-sm text-right whitespace-nowrap">Vencimento</TableHead>
              <TableHead className="py-1.5 px-3 text-sm text-right whitespace-nowrap">Status</TableHead>
              <TableHead className="py-1.5 px-3 text-sm text-center whitespace-nowrap">Conta</TableHead>
              <TableHead className="py-1.5 px-3 text-sm text-right sticky right-0 bg-gray-50 whitespace-nowrap">Ações</TableHead>
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
    </div>
  );
}
