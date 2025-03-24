
/**
 * Tabela de lançamentos financeiros
 * 
 * Este componente renderiza uma tabela com todos os lançamentos financeiros
 * de um determinado tipo (receita ou despesa). Inclui informações como
 * descrição, valor, status, data de vencimento e ações.
 * Exibe o mês de referência das faturas para facilitar identificação.
 */
import { LancamentoFinanceiro, StatusLancamento } from "@/types/financeiro";
import { formatarMoeda } from "@/utils/formatters";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, Eye, MoreHorizontal, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SkeletonTable } from "@/components/ui/skeleton";
import { LancamentoDetailsDialog } from "../modals/LancamentoDetailsDialog";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "../utils/status";

interface LancamentosTableProps {
  lancamentos: LancamentoFinanceiro[] | undefined;
  isLoading: boolean;
  tipo: "receita" | "despesa";
  refetch?: () => void;
}

export function LancamentosTable({
  lancamentos,
  isLoading,
  tipo,
  refetch,
}: LancamentosTableProps) {
  const [selectedLancamento, setSelectedLancamento] = useState<LancamentoFinanceiro | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleViewDetails = (lancamento: LancamentoFinanceiro) => {
    setSelectedLancamento(lancamento);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedLancamento(null);
  };

  // Função para obter o mês de referência formatado
  const getMesReferencia = (lancamento: LancamentoFinanceiro) => {
    if (lancamento.fatura?.mes && lancamento.fatura?.ano) {
      return format(new Date(lancamento.fatura.ano, lancamento.fatura.mes - 1), "MMMM/yyyy", { locale: ptBR });
    } else if (lancamento.pagamento_usina?.mes && lancamento.pagamento_usina?.ano) {
      return format(new Date(lancamento.pagamento_usina.ano, lancamento.pagamento_usina.mes - 1), "MMMM/yyyy", { locale: ptBR });
    }
    return lancamento.descricao;
  };

  // Função para obter ID/número que identifica o lançamento
  const getIdentificador = (lancamento: LancamentoFinanceiro) => {
    if (lancamento.fatura?.numero_fatura) {
      return lancamento.fatura.numero_fatura;
    } else if (lancamento.pagamento_usina?.id) {
      return `PG-${lancamento.pagamento_usina.id.substring(0, 6)}`;
    }
    return lancamento.id.substring(0, 7);
  };

  // Formatar a descrição conforme o mês de referência
  const formatarDescricao = (lancamento: LancamentoFinanceiro) => {
    const mesReferencia = getMesReferencia(lancamento);
    const identificador = getIdentificador(lancamento);
    
    // Se é o mesmo que a descrição, significa que não tem mês de referência
    if (mesReferencia === lancamento.descricao) {
      return lancamento.descricao;
    }
    
    return `${mesReferencia} - ${identificador}`;
  };

  // Determinar o rótulo do contato (cooperado ou investidor)
  const getLabelContato = () => {
    return tipo === 'receita' ? 'Cooperado' : 'Investidor';
  };

  // Obter o nome do contato (cooperado ou investidor)
  const getNomeContato = (lancamento: LancamentoFinanceiro) => {
    if (tipo === 'receita') {
      return lancamento.cooperado?.nome || '-';
    } else {
      return lancamento.investidor?.nome_investidor || '-';
    }
  };

  if (isLoading) {
    return <SkeletonTable columns={6} rows={5} />;
  }

  if (!lancamentos || lancamentos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg border-dashed">
        <h3 className="text-lg font-semibold">Nenhum lançamento encontrado</h3>
        <p className="text-sm text-gray-500">
          Não existem lançamentos cadastrados para os filtros selecionados.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>{getLabelContato()}</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lancamentos.map((lancamento) => (
              <TableRow key={lancamento.id}>
                <TableCell className="font-medium">
                  {formatarDescricao(lancamento)}
                </TableCell>
                <TableCell>{getNomeContato(lancamento)}</TableCell>
                <TableCell>
                  {format(new Date(lancamento.data_vencimento), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>{formatarMoeda(lancamento.valor)}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`${getStatusColor(
                      lancamento.status as StatusLancamento
                    )}`}
                  >
                    {lancamento.status.charAt(0).toUpperCase() +
                      lancamento.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDetails(lancamento)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalhes
                      </DropdownMenuItem>
                      {lancamento.status === 'pendente' && (
                        <DropdownMenuItem>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Marcar como pago
                        </DropdownMenuItem>
                      )}
                      {lancamento.status === 'pendente' && (
                        <DropdownMenuItem>
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancelar
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <LancamentoDetailsDialog
        lancamento={selectedLancamento}
        isOpen={showDetails}
        onClose={handleCloseDetails}
        onAfterStatusChange={refetch}
      />
    </>
  );
}
