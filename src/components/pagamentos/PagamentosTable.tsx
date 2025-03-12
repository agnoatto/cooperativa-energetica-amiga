
/**
 * Componente de tabela para listagem de pagamentos de usinas
 * 
 * Esta tabela exibe todos os pagamentos com informações como unidade consumidora,
 * investidor, valores e opções de ações como visualizar detalhes e editar.
 */
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
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
  onSelectionChange?: (selectedIds: string[]) => void;
}

export function PagamentosTable({
  pagamentos,
  isLoading,
  onEditPagamento,
  onViewDetails,
  onDeletePagamento,
  onSelectionChange,
}: PagamentosTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  if (isLoading) {
    return <PagamentosLoadingState />;
  }

  if (!pagamentos?.length) {
    return <PagamentosEmptyState />;
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = pagamentos.map(p => p.id);
      setSelectedIds(allIds);
      onSelectionChange?.(allIds);
    } else {
      setSelectedIds([]);
      onSelectionChange?.([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    let newSelectedIds;
    if (checked) {
      newSelectedIds = [...selectedIds, id];
    } else {
      newSelectedIds = selectedIds.filter(selectedId => selectedId !== id);
    }
    setSelectedIds(newSelectedIds);
    onSelectionChange?.(newSelectedIds);
  };

  const allSelected = pagamentos.length > 0 && selectedIds.length === pagamentos.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < pagamentos.length;

  return (
    <div className="rounded-md border border-gray-200 overflow-hidden">
      <Table className="w-full [&_th]:bg-gray-50 [&_th]:font-medium [&_th]:text-gray-700 [&_th]:h-9 [&_tr]:border-b [&_tr]:border-gray-200">
        <TableHeader className="[&_tr]:border-b [&_tr]:border-gray-200">
          <TableRow className="h-9">
            <TableHead className="py-1.5 px-3 w-10">
              <Checkbox 
                checked={allSelected} 
                onCheckedChange={handleSelectAll}
                className="rounded-sm"
                aria-label="Selecionar todos os pagamentos"
              />
            </TableHead>
            <TableHead className="py-1.5 px-3 text-sm">UC</TableHead>
            <TableHead className="py-1.5 px-3 text-sm">Investidor</TableHead>
            <TableHead className="py-1.5 px-3 text-sm text-right">Geração (kWh)</TableHead>
            <TableHead className="py-1.5 px-3 text-sm text-right">Valor Concess.</TableHead>
            <TableHead className="py-1.5 px-3 text-sm text-right">Valor Total</TableHead>
            <TableHead className="py-1.5 px-3 text-sm text-right">Status</TableHead>
            <TableHead className="py-1.5 px-3 text-sm text-center">Conta</TableHead>
            <TableHead className="py-1.5 px-3 text-sm text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pagamentos.map((pagamento) => (
            <React.Fragment key={pagamento.id}>
              <TableRow className="h-9 hover:bg-gray-50">
                <TableHead className="py-1.5 px-3 w-10">
                  <Checkbox 
                    checked={selectedIds.includes(pagamento.id)} 
                    onCheckedChange={(checked) => handleSelectOne(pagamento.id, !!checked)}
                    className="rounded-sm"
                    aria-label={`Selecionar pagamento ${pagamento.id}`}
                  />
                </TableHead>
                <PagamentoTableRow
                  pagamento={pagamento}
                  onEdit={onEditPagamento}
                  onDelete={onDeletePagamento}
                  onViewDetails={onViewDetails}
                />
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
