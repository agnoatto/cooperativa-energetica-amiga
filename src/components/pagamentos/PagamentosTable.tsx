
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
import { BoletimMedicaoButton } from "./BoletimMedicaoButton";
import { PagamentoData } from "./types/pagamento";
import { BoletimMedicaoData } from "./types/boletim";

interface PagamentosTableProps {
  pagamentos: PagamentoData[] | undefined;
  isLoading: boolean;
  onEditPagamento: (pagamento: PagamentoData) => void;
}

export function PagamentosTable({ pagamentos, isLoading, onEditPagamento }: PagamentosTableProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const prepareBoletimData = (pagamento: PagamentoData): BoletimMedicaoData => {
    return {
      usina: {
        nome_investidor: pagamento.usina?.investidor?.nome_investidor || '',
        numero_uc: pagamento.usina?.unidade_usina?.numero_uc || '',
        concessionaria: 'RGE', // Hardcoded por enquanto
        modalidade: 'GD2', // Hardcoded por enquanto
        valor_kwh: pagamento.usina?.valor_kwh || 0,
      },
      pagamentos: [pagamento],
      data_emissao: new Date(),
      valor_receber: pagamento.valor_total,
    };
  };

  return (
    <div className="rounded-md border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="w-full border-collapse [&_tr:hover]:bg-gray-50">
          <TableHeader className="[&_tr]:h-8 [&_th]:p-2 [&_th]:border-x [&_th]:border-gray-200 [&_tr]:border-b [&_tr]:border-gray-200">
            <TableRow>
              <TableHead>Usina</TableHead>
              <TableHead>Investidor</TableHead>
              <TableHead>Geração (kWh)</TableHead>
              <TableHead>TUSD Fio B</TableHead>
              <TableHead>Valor Concessionária</TableHead>
              <TableHead>Valor Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr]:h-8 [&_td]:p-2 [&_td]:border-x [&_td]:border-gray-200 [&_tr]:border-b [&_tr]:border-gray-200">
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : pagamentos && pagamentos.length > 0 ? (
              pagamentos.map((pagamento) => (
                <TableRow key={pagamento.id}>
                  <TableCell className="whitespace-nowrap">{pagamento.usina?.unidade_usina?.numero_uc || 'N/A'}</TableCell>
                  <TableCell className="whitespace-nowrap">{pagamento.usina?.investidor?.nome_investidor || 'N/A'}</TableCell>
                  <TableCell className="whitespace-nowrap">{pagamento.geracao_kwh} kWh</TableCell>
                  <TableCell className="whitespace-nowrap">{formatCurrency(pagamento.valor_tusd_fio_b || pagamento.tusd_fio_b || 0)}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatCurrency(pagamento.valor_concessionaria)}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatCurrency(pagamento.valor_total)}</TableCell>
                  <TableCell className="whitespace-nowrap">
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
                  <TableCell className="text-right whitespace-nowrap">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onEditPagamento(pagamento)}
                        title="Editar Pagamento"
                        className="h-6 w-6"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <PagamentoPdfButton pagamento={pagamento} className="h-6 w-6" />
                      <BoletimMedicaoButton boletimData={prepareBoletimData(pagamento)} />
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
    </div>
  );
}
