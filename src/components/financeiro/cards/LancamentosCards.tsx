
/**
 * Cards de lançamentos financeiros para visualização mobile
 * 
 * Este componente exibe os lançamentos financeiros em formato de cards
 * otimizados para dispositivos móveis. A data de vencimento é obtida
 * diretamente da fatura ou pagamento quando disponível. O status "atrasado"
 * é determinado automaticamente com base na data de vencimento.
 */
import { format } from "date-fns";
import { LancamentoFinanceiro } from "@/types/financeiro";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Calendar, User, DollarSign } from "lucide-react";
import { formatarMoeda } from "@/utils/formatters";
import { getStatusColor } from "../utils/status";
import { useState } from "react";
import { LancamentoDetailsDialog } from "../modals/LancamentoDetailsDialog";
import { StatusTransitionButtons } from "../StatusTransitionButtons";

interface LancamentosCardsProps {
  lancamentos?: LancamentoFinanceiro[];
  isLoading: boolean;
  tipo: 'receita' | 'despesa';
  refetch?: () => void;
}

export function LancamentosCards({ lancamentos, isLoading, tipo, refetch }: LancamentosCardsProps) {
  const [selectedLancamento, setSelectedLancamento] = useState<LancamentoFinanceiro | null>(null);

  // Função para obter a data de vencimento da fonte primária (fatura ou pagamento usina)
  const getDataVencimento = (lancamento: LancamentoFinanceiro) => {
    if (tipo === 'receita' && lancamento.fatura?.data_vencimento) {
      return new Date(lancamento.fatura.data_vencimento);
    } else if (tipo === 'despesa' && lancamento.pagamento_usina?.data_vencimento) {
      return new Date(lancamento.pagamento_usina.data_vencimento);
    }
    
    // Fallback para a data do lançamento (apenas como último recurso)
    return new Date(lancamento.data_vencimento);
  };

  const handleAfterStatusChange = () => {
    if (refetch) {
      refetch();
    }
    setSelectedLancamento(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!lancamentos || lancamentos.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          Nenhum lançamento encontrado
        </CardContent>
      </Card>
    );
  }

  const getNomeEntidade = (lancamento: LancamentoFinanceiro) => {
    if (tipo === 'receita') {
      return lancamento.cooperado?.nome;
    }
    return lancamento.investidor?.nome_investidor;
  };

  return (
    <>
      <div className="space-y-4">
        {lancamentos?.map((lancamento) => (
          <Card key={lancamento.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-900 truncate">
                  {lancamento.descricao}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                    lancamento.status
                  )}`}
                >
                  {lancamento.status.charAt(0).toUpperCase() +
                    lancamento.status.slice(1)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="py-2">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <User className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-gray-700">{getNomeEntidade(lancamento)}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-gray-700">
                    {format(getDataVencimento(lancamento), "dd/MM/yyyy")}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-gray-700">{formatarMoeda(lancamento.valor)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2 flex flex-col space-y-3">
              <StatusTransitionButtons 
                lancamento={lancamento}
                onAfterStatusChange={handleAfterStatusChange}
                className="w-full justify-center"
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSelectedLancamento(lancamento)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver detalhes
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <LancamentoDetailsDialog
        lancamento={selectedLancamento}
        isOpen={!!selectedLancamento}
        onClose={() => setSelectedLancamento(null)}
        onAfterStatusChange={handleAfterStatusChange}
      />
    </>
  );
}
