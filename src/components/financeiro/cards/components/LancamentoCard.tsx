
/**
 * Componente de cartão de lançamento financeiro individual
 * 
 * Este componente exibe as informações de um único lançamento em formato de cartão,
 * incluindo descrição, status, valores e menu de ações.
 * Utiliza Popover para o menu de ações para melhor performance e estabilidade.
 */
import { LancamentoFinanceiro, StatusLancamento } from "@/types/financeiro";
import { formatarMoeda } from "@/utils/formatters";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CheckCircle2, Eye, MoreVertical, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "../../utils/status";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ActionMenuItem } from "../../table/components/ActionMenuItem";

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
  const [open, setOpen] = useState(false);
  
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

  const handleViewDetails = () => {
    onViewDetails(lancamento);
    setOpen(false);
  };

  const handlePagar = () => {
    // Implementação futura
    console.log("Marcar como pago:", lancamento.id);
    setOpen(false);
  };

  const handleCancelar = () => {
    // Implementação futura
    console.log("Cancelar lançamento:", lancamento.id);
    setOpen(false);
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
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-5 w-5" />
              <span className="sr-only">Mais opções</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-52 p-1">
            <div className="flex flex-col gap-0.5">
              <ActionMenuItem
                icon={<Eye className="mr-2 h-4 w-4" />}
                label="Ver detalhes"
                onClick={handleViewDetails}
              />
              
              {lancamento.status === 'pendente' && (
                <ActionMenuItem
                  icon={<CheckCircle2 className="mr-2 h-4 w-4" />}
                  label="Marcar como pago"
                  onClick={handlePagar}
                />
              )}
              
              {lancamento.status === 'pendente' && (
                <ActionMenuItem
                  icon={<XCircle className="mr-2 h-4 w-4" />}
                  label="Cancelar"
                  onClick={handleCancelar}
                />
              )}
            </div>
          </PopoverContent>
        </Popover>
      </CardFooter>
    </Card>
  );
}
