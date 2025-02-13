
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
import { useIsMobile } from "@/hooks/use-mobile";

interface PagamentosTableProps {
  pagamentos: PagamentoData[] | undefined;
  isLoading: boolean;
  onEditPagamento: (pagamento: PagamentoData) => void;
}

export function PagamentosTable({ pagamentos, isLoading, onEditPagamento }: PagamentosTableProps) {
  const isMobile = useIsMobile();

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const prepareBoletimData = (pagamento: PagamentoData): BoletimMedicaoData => {
    const historicoGeracoes = pagamentos?.filter(p => 
      p.usina.unidade_usina.numero_uc === pagamento.usina.unidade_usina.numero_uc
    ).sort((a, b) => {
      if (a.ano !== b.ano) return a.ano - b.ano;
      return a.mes - b.mes;
    }) || [];

    return {
      usina: {
        nome_investidor: pagamento.usina?.investidor?.nome_investidor || '',
        numero_uc: pagamento.usina?.unidade_usina?.numero_uc || '',
        concessionaria: 'RGE',
        modalidade: 'GD2',
        valor_kwh: pagamento.usina?.valor_kwh || 0,
      },
      pagamentos: historicoGeracoes,
      data_emissao: new Date(),
      valor_receber: pagamento.valor_total,
    };
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-sm text-gray-500">Carregando pagamentos...</p>
      </div>
    );
  }

  if (!pagamentos || pagamentos.length === 0) {
    return (
      <div className="text-center py-8 px-4">
        <p className="text-gray-500">Nenhum pagamento encontrado para este mês</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-4">
        {pagamentos.map((pagamento) => (
          <div 
            key={pagamento.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-gray-900">
                  {pagamento.usina?.unidade_usina?.numero_uc}
                </h3>
                <p className="text-sm text-gray-500">
                  {pagamento.usina?.investidor?.nome_investidor}
                </p>
              </div>
              <div className={`px-2 py-1 rounded-full text-sm ${
                pagamento.status === 'pendente'
                  ? 'bg-yellow-100 text-yellow-800'
                  : pagamento.status === 'pago'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {pagamento.status.charAt(0).toUpperCase() + pagamento.status.slice(1)}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-1">
                <span className="text-gray-500">Geração:</span>
                <span>{pagamento.geracao_kwh} kWh</span>
              </div>

              <div className="grid grid-cols-2 gap-1">
                <span className="text-gray-500">TUSD Fio B:</span>
                <span>{formatCurrency(pagamento.valor_tusd_fio_b || pagamento.tusd_fio_b || 0)}</span>
              </div>

              <div className="grid grid-cols-2 gap-1">
                <span className="text-gray-500">Valor Concessionária:</span>
                <span>{formatCurrency(pagamento.valor_concessionaria)}</span>
              </div>

              <div className="grid grid-cols-2 gap-1 pt-2 border-t border-gray-100 mt-2">
                <span className="text-gray-900 font-medium">Valor Total:</span>
                <span className="text-gray-900 font-medium">
                  {formatCurrency(pagamento.valor_total)}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditPagamento(pagamento)}
                className="h-10 w-10 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <PagamentoPdfButton pagamento={pagamento} className="h-10 w-10" />
              <BoletimMedicaoButton boletimData={prepareBoletimData(pagamento)} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
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
          <TableBody>
            {pagamentos.map((pagamento) => (
              <TableRow key={pagamento.id}>
                <TableCell>{pagamento.usina?.unidade_usina?.numero_uc}</TableCell>
                <TableCell>{pagamento.usina?.investidor?.nome_investidor}</TableCell>
                <TableCell>{pagamento.geracao_kwh} kWh</TableCell>
                <TableCell>{formatCurrency(pagamento.valor_tusd_fio_b || pagamento.tusd_fio_b || 0)}</TableCell>
                <TableCell>{formatCurrency(pagamento.valor_concessionaria)}</TableCell>
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
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEditPagamento(pagamento)}
                    className="h-8 w-8"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <PagamentoPdfButton pagamento={pagamento} className="h-8 w-8" />
                  <BoletimMedicaoButton boletimData={prepareBoletimData(pagamento)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
