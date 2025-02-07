
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usina</TableHead>
            <TableHead>Investidor</TableHead>
            <TableHead>Geração (kWh)</TableHead>
            <TableHead>TUSD Fio B</TableHead>
            <TableHead>Conta de Energia</TableHead>
            <TableHead>Valor Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
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
              <TableRow key={pagamento.id}>
                <TableCell>{pagamento.usina.unidade_usina.numero_uc}</TableCell>
                <TableCell>{pagamento.usina.investidor.nome_investidor}</TableCell>
                <TableCell>{pagamento.geracao_kwh} kWh</TableCell>
                <TableCell>{formatCurrency(pagamento.valor_tusd_fio_b)}</TableCell>
                <TableCell>{formatCurrency(pagamento.conta_energia)}</TableCell>
                <TableCell>{formatCurrency(pagamento.valor_total)}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    pagamento.status === 'pendente'
                      ? 'bg-yellow-100 text-yellow-800'
                      : pagamento.status === 'pago'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {pagamento.status.charAt(0).toUpperCase() + pagamento.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEditPagamento(pagamento)}
                      title="Editar Pagamento"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <PagamentoPdfButton pagamento={pagamento} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-gray-500">
                Nenhum pagamento encontrado para este mês
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
