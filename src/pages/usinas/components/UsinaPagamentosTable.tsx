
// Este componente apresenta a tabela de pagamentos da usina
// Exibe histórico de pagamentos com status e valores
// Utiliza ScrollArea para garantir uma experiência de scroll horizontal suave

import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { formatarMoeda } from "@/utils/formatters";
import { PagamentoUsina } from "../hooks/useUsinaPagamentos";
import { PagamentoBadge } from "./PagamentoBadge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface UsinaPagamentosTableProps {
  pagamentos?: PagamentoUsina[];
  isLoading: boolean;
}

export function UsinaPagamentosTable({ pagamentos, isLoading }: UsinaPagamentosTableProps) {
  function getNomeMes(numeroMes: number) {
    const data = new Date(2000, numeroMes - 1, 1);
    return format(data, 'MMMM', { locale: ptBR });
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (!pagamentos?.length) {
    return (
      <div className="text-center py-8 border rounded-md">
        <p className="text-muted-foreground">Nenhum pagamento encontrado</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md shadow-sm overflow-hidden">
      <ScrollArea className="h-[calc(100vh-450px)] w-full">
        <div className="relative w-full">
          <Table className="w-full min-w-[800px] table-fixed">
            <TableHeader className="bg-gray-50 sticky top-0 z-10">
              <TableRow className="border-b border-gray-200">
                <TableHead className="w-[100px] py-3 px-4 text-sm font-medium text-gray-700">Período</TableHead>
                <TableHead className="w-[120px] py-3 px-4 text-sm font-medium text-gray-700">Geração (kWh)</TableHead>
                <TableHead className="w-[120px] py-3 px-4 text-sm font-medium text-gray-700">Valor</TableHead>
                <TableHead className="w-[120px] py-3 px-4 text-sm font-medium text-gray-700">Vencimento</TableHead>
                <TableHead className="w-[100px] py-3 px-4 text-sm font-medium text-gray-700">Status</TableHead>
                <TableHead className="w-[240px] py-3 px-4 text-sm font-medium text-gray-700">Observação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagamentos.map((pagamento) => (
                <TableRow key={pagamento.id} className="border-b border-gray-200 hover:bg-gray-50/70 transition-colors">
                  <TableCell className="py-3 px-4 text-sm">
                    {getNomeMes(pagamento.mes)}/{pagamento.ano}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-sm">
                    {pagamento.geracao_kwh?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-sm">{formatarMoeda(pagamento.valor_total)}</TableCell>
                  <TableCell className="py-3 px-4 text-sm">
                    {pagamento.data_vencimento && format(new Date(pagamento.data_vencimento), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-sm">
                    <PagamentoBadge status={pagamento.status} />
                  </TableCell>
                  <TableCell className="py-3 px-4 text-sm">
                    <div className="max-w-[220px] truncate">
                      {pagamento.observacao || '-'}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
}
