
/**
 * Cards de lançamentos financeiros para visualização mobile
 *
 * Este componente exibe os lançamentos financeiros em formato de cartões,
 * otimizado para dispositivos móveis. Inclui informações como mês de referência,
 * valor, status e ações.
 */
import { LancamentoFinanceiro, StatusLancamento } from "@/types/financeiro";
import { formatarMoeda } from "@/utils/formatters";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CheckCircle2, Eye, MoreVertical, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { LancamentoDetailsDialog } from "../modals/LancamentoDetailsDialog";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "../utils/status";

interface LancamentosCardsProps {
  lancamentos: LancamentoFinanceiro[] | undefined;
  isLoading: boolean;
  tipo: "receita" | "despesa";
  refetch?: () => void;
}

export function LancamentosCards({
  lancamentos,
  isLoading,
  tipo,
  refetch,
}: LancamentosCardsProps) {
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
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-end">
              <Skeleton className="h-8 w-8 rounded-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
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
      <div className="space-y-3">
        {lancamentos.map((lancamento) => (
          <Card key={lancamento.id}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <h3 className="font-medium">{formatarDescricao(lancamento)}</h3>
                  <Badge
                    variant="outline"
                    className={`${getStatusColor(
                      lancamento.status as StatusLancamento
                    )}`}
                  >
                    {lancamento.status.charAt(0).toUpperCase() +
                      lancamento.status.slice(1)}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  <div>
                    <strong>{getLabelContato()}:</strong> {getNomeContato(lancamento)}
                  </div>
                  <div>
                    <strong>Vencimento:</strong>{" "}
                    {format(new Date(lancamento.data_vencimento), "dd/MM/yyyy")}
                  </div>
                  <div>
                    <strong>Valor:</strong> {formatarMoeda(lancamento.valor)}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <MoreVertical className="h-5 w-5" />
                    <span className="sr-only">Mais opções</span>
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
            </CardFooter>
          </Card>
        ))}
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
