
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { PagamentoPdfButton } from "./PagamentoPdfButton";

interface Pagamento {
  id: string;
  geracao_kwh: number;
  valor_tusd_fio_b: number;
  conta_energia: number;
  valor_total: number;
  status: string;
  data_vencimento: string;
  data_pagamento: string | null;
  mes: number;
  ano: number;
  economia_mes: number | null;
  economia_acumulada: number | null;
  usina: {
    id: string;
    unidade_usina: {
      numero_uc: string;
    };
    investidor: {
      nome_investidor: string;
    };
  };
}

interface PagamentosTableProps {
  pagamentos: Pagamento[] | undefined;
  isLoading: boolean;
  onEditPagamento: (pagamento: Pagamento) => void;
}

export function PagamentosTable({ pagamentos, isLoading, onEditPagamento }: PagamentosTableProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-md">
      <div className="min-w-[1000px]">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200 bg-gray-50">
              <TableHead className="h-9 px-2 text-xs font-medium text-gray-600">Usina</TableHead>
              <TableHead className="h-9 px-2 text-xs font-medium text-gray-600">Investidor</TableHead>
              <TableHead className="h-9 px-2 text-xs font-medium text-gray-600">Geração (kWh)</TableHead>
              <TableHead className="h-9 px-2 text-xs font-medium text-gray-600">TUSD Fio B</TableHead>
              <TableHead className="h-9 px-2 text-xs font-medium text-gray-600">Conta de Energia</TableHead>
              <TableHead className="h-9 px-2 text-xs font-medium text-gray-600">Valor Total</TableHead>
              <TableHead className="h-9 px-2 text-xs font-medium text-gray-600">Status</TableHead>
              <TableHead className="h-9 px-2 text-xs font-medium text-gray-600 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : pagamentos && pagamentos.length > 0 ? (
              pagamentos.map((pagamento) => (
                <TableRow key={pagamento.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                  <TableCell className="py-2 px-2 text-sm">{pagamento.usina?.unidade_usina?.numero_uc || 'N/A'}</TableCell>
                  <TableCell className="py-2 px-2 text-sm">{pagamento.usina?.investidor?.nome_investidor || 'N/A'}</TableCell>
                  <TableCell className="py-2 px-2 text-sm whitespace-nowrap">{pagamento.geracao_kwh} kWh</TableCell>
                  <TableCell className="py-2 px-2 text-sm whitespace-nowrap">{formatCurrency(pagamento.valor_tusd_fio_b)}</TableCell>
                  <TableCell className="py-2 px-2 text-sm whitespace-nowrap">{formatCurrency(pagamento.conta_energia)}</TableCell>
                  <TableCell className="py-2 px-2 text-sm whitespace-nowrap">{formatCurrency(pagamento.valor_total)}</TableCell>
                  <TableCell className="py-2 px-2">
                    <span className={`inline-flex px-2 py-0.5 text-xs rounded-full whitespace-nowrap ${
                      pagamento.status === 'pendente'
                        ? 'bg-yellow-50 text-yellow-700'
                        : pagamento.status === 'pago'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-700'
                    }`}>
                      {pagamento.status.charAt(0).toUpperCase() + pagamento.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="py-2 px-2 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onEditPagamento(pagamento)}
                        title="Editar Pagamento"
                        className="h-7 w-7"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <PagamentoPdfButton pagamento={pagamento} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-sm text-gray-500">
                  Nenhum pagamento encontrado para este mês
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
