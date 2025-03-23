
/**
 * Tabela de lançamentos financeiros
 * 
 * Este componente exibe os lançamentos financeiros de receitas ou despesas
 * em formato de tabela, com opções para gerenciamento e visualização
 * de detalhes. A data de vencimento é exibida diretamente da fatura ou
 * do registro de pagamento quando disponível.
 */
import { format } from "date-fns";
import { Eye, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LancamentoFinanceiro, StatusLancamento } from "@/types/financeiro";
import { formatarMoeda } from "@/utils/formatters";
import { getStatusColor } from "../utils/status";
import { useState } from "react";
import { LancamentoDetailsDialog } from "../modals/LancamentoDetailsDialog";
import { useUpdateLancamentoStatus } from "@/hooks/lancamentos/useUpdateLancamentoStatus";

interface LancamentosTableProps {
  lancamentos?: LancamentoFinanceiro[];
  isLoading: boolean;
  tipo: 'receita' | 'despesa';
  refetch?: () => void;
}

export function LancamentosTable({ lancamentos, isLoading, tipo, refetch }: LancamentosTableProps) {
  const [selectedLancamento, setSelectedLancamento] = useState<LancamentoFinanceiro | null>(null);
  const { updateLancamentoStatus } = useUpdateLancamentoStatus();

  const getNomeEntidade = (lancamento: LancamentoFinanceiro) => {
    if (tipo === 'receita') {
      return lancamento.cooperado?.nome;
    }
    return lancamento.investidor?.nome_investidor;
  };

  const getLabelEntidade = () => {
    return tipo === 'receita' ? 'Cooperado' : 'Investidor';
  };

  // Função que atualiza o status e retorna boolean para compatibilidade
  const handleUpdateStatus = async (lancamento: LancamentoFinanceiro, newStatus: StatusLancamento) => {
    const success = await updateLancamentoStatus(lancamento, newStatus);
    if (success && refetch) {
      refetch();
    }
    return success;
  };

  const handleViewDetails = (lancamento: LancamentoFinanceiro) => {
    setSelectedLancamento(lancamento);
  };

  // Função para obter a data de vencimento mais atualizada
  const getDataVencimento = (lancamento: LancamentoFinanceiro) => {
    // Prioriza a data da fatura/pagamento_usina sobre a data do lançamento
    if (tipo === 'receita' && lancamento.fatura?.data_vencimento) {
      return new Date(lancamento.fatura.data_vencimento);
    } else if (tipo === 'despesa' && lancamento.pagamento_usina?.data_vencimento) {
      return new Date(lancamento.pagamento_usina.data_vencimento);
    }
    
    // Fallback para a data do lançamento
    return new Date(lancamento.data_vencimento);
  };

  return (
    <>
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>{getLabelEntidade()}</TableHead>
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
                  <TableCell>{getNomeEntidade(lancamento)}</TableCell>
                  <TableCell>
                    {format(getDataVencimento(lancamento), "dd/MM/yyyy")}
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
                      onClick={() => handleViewDetails(lancamento)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {(tipo === 'receita' ? lancamento.fatura : lancamento.pagamento_usina) && (
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

      <LancamentoDetailsDialog
        lancamento={selectedLancamento}
        isOpen={!!selectedLancamento}
        onClose={() => setSelectedLancamento(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </>
  );
}
