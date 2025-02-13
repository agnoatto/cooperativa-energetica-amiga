
import { useState } from "react";
import { useLancamentosFinanceiros } from "@/hooks/useLancamentosFinanceiros";
import { FiltrosLancamento } from "@/components/financeiro/FiltrosLancamento";
import { StatusLancamento } from "@/types/financeiro";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatarMoeda } from "@/utils/formatters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Eye, FileText } from "lucide-react";

export default function ContasPagar() {
  const [status, setStatus] = useState<StatusLancamento | 'todos'>('todos');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [busca, setBusca] = useState('');
  const isMobile = useIsMobile();

  const { data: lancamentos, isLoading } = useLancamentosFinanceiros({
    tipo: 'despesa',
    status,
    dataInicio,
    dataFim,
    busca,
  });

  const getStatusColor = (status: StatusLancamento) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'pago':
        return 'bg-green-100 text-green-800';
      case 'atrasado':
        return 'bg-red-100 text-red-800';
      case 'cancelado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLimparFiltros = () => {
    setStatus('todos');
    setDataInicio('');
    setDataFim('');
    setBusca('');
  };

  if (isMobile) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Contas a Pagar</h1>
        
        <FiltrosLancamento
          status={status}
          dataInicio={dataInicio}
          dataFim={dataFim}
          busca={busca}
          onStatusChange={setStatus}
          onDataInicioChange={setDataInicio}
          onDataFimChange={setDataFim}
          onBuscaChange={setBusca}
          onLimparFiltros={handleLimparFiltros}
        />

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-4">Carregando...</div>
          ) : lancamentos?.length === 0 ? (
            <div className="text-center py-4">Nenhum lançamento encontrado</div>
          ) : (
            lancamentos?.map((lancamento) => (
              <div
                key={lancamento.id}
                className="bg-white rounded-lg shadow-sm border p-4 space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{lancamento.descricao}</h3>
                    <p className="text-sm text-gray-500">
                      {lancamento.investidor?.nome_investidor}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(lancamento.status)}`}>
                    {lancamento.status.charAt(0).toUpperCase() + lancamento.status.slice(1)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Vencimento:</span>
                    <br />
                    {format(new Date(lancamento.data_vencimento), "dd/MM/yyyy")}
                  </div>
                  <div>
                    <span className="text-gray-500">Valor:</span>
                    <br />
                    {formatarMoeda(lancamento.valor)}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {lancamento.pagamento_usina && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Contas a Pagar</h1>

      <FiltrosLancamento
        status={status}
        dataInicio={dataInicio}
        dataFim={dataFim}
        busca={busca}
        onStatusChange={setStatus}
        onDataInicioChange={setDataInicio}
        onDataFimChange={setDataFim}
        onBuscaChange={setBusca}
        onLimparFiltros={handleLimparFiltros}
      />

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Investidor</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : lancamentos?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Nenhum lançamento encontrado
                </TableCell>
              </TableRow>
            ) : (
              lancamentos?.map((lancamento) => (
                <TableRow key={lancamento.id}>
                  <TableCell>{lancamento.descricao}</TableCell>
                  <TableCell>{lancamento.investidor?.nome_investidor}</TableCell>
                  <TableCell>
                    {format(new Date(lancamento.data_vencimento), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>{formatarMoeda(lancamento.valor)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(lancamento.status)}`}>
                      {lancamento.status.charAt(0).toUpperCase() + lancamento.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {lancamento.pagamento_usina && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 ml-2"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
