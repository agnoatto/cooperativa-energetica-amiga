
/**
 * Componente de cartão de lançamento financeiro individual
 * 
 * Este componente exibe as informações de um único lançamento em formato de cartão,
 * incluindo descrição, status, valores e menu de ações.
 */
import { LancamentoFinanceiro, StatusLancamento } from "@/types/financeiro";
import { formatarMoeda } from "@/utils/formatters";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CheckCircle2, Eye, MoreVertical, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getStatusColor } from "../../utils/status";

interface LancamentoCardProps {
  lancamento: LancamentoFinanceiro;
  tipo: "receita" | "despesa";
  onViewDetails: (lancamento: LancamentoFinanceiro) => void;
}

export function LancamentoCard({ 
  lancamento, 
  tipo, 
  onViewDetails 
}: LancamentoCardProps) {
  // Função para obter o mês de referência formatado
  const getMesReferencia = () => {
    if (lancamento.fatura?.mes && lancamento.fatura?.ano) {
      return format(new Date(lancamento.fatura.ano, lancamento.fatura.mes - 1), "MMMM/yyyy", { locale: ptBR });
    } else if (lancamento.pagamento_usina?.mes && lancamento.pagamento_usina?.ano) {
      return format(new Date(lancamento.pagamento_usina.ano, lancamento.pagamento_usina.mes - 1), "MMMM/yyyy", { locale: ptBR });
    }
    return lancamento.descricao;
  };

  // Função para obter ID/número que identifica o lançamento
  const getIdentificador = () => {
    if (lancamento.fatura?.numero_fatura) {
      return lancamento.fatura.numero_fatura;
    } else if (lancamento.pagamento_usina?.id) {
      return `PG-${lancamento.pagamento_usina.id.substring(0, 6)}`;
    }
    return lancamento.id.substring(0, 7);
  };

  // Formatar a descrição conforme o mês de referência
  const formatarDescricao = () => {
    const mesReferencia = getMesReferencia();
    const identificador = getIdentificador();
    
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
  const getNomeContato = () => {
    if (tipo === 'receita') {
      return lancamento.cooperado?.nome || '-';
    } else {
      return lancamento.investidor?.nome_investidor || '-';
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between">
            <h3 className="font-medium">{formatarDescricao()}</h3>
            <Badge
              variant="outline"
              className={getStatusColor(lancamento.status as StatusLancamento)}
            >
              {lancamento.status.charAt(0).toUpperCase() + lancamento.status.slice(1)}
            </Badge>
          </div>
          <div className="text-sm text-gray-600">
            <div>
              <strong>{getLabelContato()}:</strong> {getNomeContato()}
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
            <DropdownMenuItem onClick={() => onViewDetails(lancamento)}>
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
  );
}
