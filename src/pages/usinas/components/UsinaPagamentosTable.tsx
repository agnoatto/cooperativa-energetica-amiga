
// Este componente apresenta a tabela de pagamentos da usina
// Exibe histórico de pagamentos com status e valores

import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Período</TableHead>
            <TableHead>Geração (kWh)</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pagamentos.map((pagamento) => (
            <TableRow key={pagamento.id}>
              <TableCell>
                {getNomeMes(pagamento.mes)}/{pagamento.ano}
              </TableCell>
              <TableCell>{pagamento.geracao_kwh?.toFixed(2) || '0.00'}</TableCell>
              <TableCell>{formatarMoeda(pagamento.valor_total)}</TableCell>
              <TableCell>
                {pagamento.data_vencimento && format(new Date(pagamento.data_vencimento), 'dd/MM/yyyy')}
              </TableCell>
              <TableCell>
                <PagamentoBadge status={pagamento.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
