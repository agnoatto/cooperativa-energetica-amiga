
/**
 * Componente de tabela para listagem de pagamentos de usinas
 * 
 * Esta tabela exibe todos os pagamentos com informações como unidade consumidora,
 * investidor, valores e opções de ações como visualizar detalhes e editar.
 * 
 * A tabela utiliza ScrollArea para garantir uma experiência de scroll horizontal
 * suave e profissional em dispositivos com telas menores.
 */
import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    <div className="border border-gray-200 rounded-md shadow-sm">
      <ScrollArea className="h-[calc(100vh-360px)] w-full rounded-md">
        <div className="relative w-full">
          <Table className="w-full min-w-[1200px] table-fixed">
            <TableHeader className="bg-gray-50 sticky top-0 z-10">
              <TableRow className="border-b border-gray-200">
                <TableHead className="w-[120px] py-3 px-4 text-sm font-medium text-gray-700">UC</TableHead>
                <TableHead className="w-[200px] py-3 px-4 text-sm font-medium text-gray-700">Investidor</TableHead>
                <TableHead className="w-[120px] py-3 px-4 text-sm font-medium text-gray-700 text-right">Geração (kWh)</TableHead>
                <TableHead className="w-[150px] py-3 px-4 text-sm font-medium text-gray-700 text-right">Valor Concess.</TableHead>
                <TableHead className="w-[150px] py-3 px-4 text-sm font-medium text-gray-700 text-right">Valor Total</TableHead>
                <TableHead className="w-[120px] py-3 px-4 text-sm font-medium text-gray-700 text-right">Vencimento</TableHead>
                <TableHead className="w-[100px] py-3 px-4 text-sm font-medium text-gray-700 text-right">Status</TableHead>
                <TableHead className="w-[120px] py-3 px-4 text-sm font-medium text-gray-700 text-center">Conta</TableHead>
                <TableHead className="w-[140px] py-3 px-4 text-sm font-medium text-gray-700 text-right sticky right-0 bg-gray-50 shadow-[-8px_0_16px_-6px_rgba(0,0,0,0.05)]">Ações</TableHead>
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
      </ScrollArea>
    </div>
  );
}
