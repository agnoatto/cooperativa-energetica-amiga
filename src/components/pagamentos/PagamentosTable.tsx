import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, FileText } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PagamentoData } from "./types/pagamento";
import { formatCurrency } from "@/utils/formatters";
import { BoletimMedicaoButton } from "./BoletimMedicaoButton";

interface PagamentosTableProps {
  pagamentos: PagamentoData[];
  isLoading: boolean;
  onEditPagamento: (pagamento: PagamentoData) => void;
}

export function PagamentosTable({
  pagamentos,
  isLoading,
  onEditPagamento,
}: PagamentosTableProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-sm text-gray-500">Carregando pagamentos...</p>
        </div>
      </div>
    );
  }

  if (!pagamentos?.length) {
    return (
      <div className="text-center p-4">
        <p className="text-sm text-gray-500">Nenhum pagamento encontrado.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>UC</TableHead>
            <TableHead>Investidor</TableHead>
            <TableHead className="text-right">Geração (kWh)</TableHead>
            <TableHead className="text-right">Valor Conc.</TableHead>
            <TableHead className="text-right">Valor Total</TableHead>
            <TableHead className="text-right">Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pagamentos.map((pagamento) => (
            <TableRow key={pagamento.id}>
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
                  onClick={() => onEditPagamento(pagamento)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <BoletimMedicaoButton 
                  boletimData={{
                    usina: {
                      nome_investidor: pagamento.usina.investidor.nome_investidor,
                      numero_uc: pagamento.usina.unidade_usina.numero_uc,
                      concessionaria: "CELESC",
                      modalidade: "Autoconsumo Remoto",
                      valor_kwh: pagamento.usina.valor_kwh
                    },
                    pagamentos: [pagamento],
                    data_emissao: new Date(),
                    valor_receber: pagamento.valor_total
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
