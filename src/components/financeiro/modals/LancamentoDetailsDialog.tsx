
/**
 * Modal para visualização detalhada de lançamentos financeiros
 * 
 * Este componente exibe todos os detalhes de um lançamento financeiro (contas a pagar/receber)
 * incluindo valores, datas, histórico de status e informações relacionadas.
 */
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LancamentoFinanceiro, StatusLancamento } from "@/types/financeiro";
import { formatarMoeda, formatarDocumento } from "@/utils/formatters";
import { StatusTransitionButtons } from "./StatusTransitionButtons";
import { HistoricoStatusList } from "./HistoricoStatusList";

interface LancamentoDetailsDialogProps {
  lancamento: LancamentoFinanceiro | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (lancamento: LancamentoFinanceiro, newStatus: StatusLancamento) => Promise<void>;
}

export function LancamentoDetailsDialog({
  lancamento,
  isOpen,
  onClose,
  onUpdateStatus
}: LancamentoDetailsDialogProps) {
  if (!lancamento) return null;

  // Determinar se é receita ou despesa para mostrar informações relevantes
  const isReceita = lancamento.tipo === 'receita';
  
  // Formatar datas
  const dataVencimento = format(new Date(lancamento.data_vencimento), 'dd/MM/yyyy', { locale: ptBR });
  const dataPagamento = lancamento.data_pagamento 
    ? format(new Date(lancamento.data_pagamento), 'dd/MM/yyyy', { locale: ptBR })
    : '-';
  const dataCriacao = format(new Date(lancamento.created_at), 'dd/MM/yyyy', { locale: ptBR });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Lançamento</DialogTitle>
          <DialogDescription>
            {isReceita ? 'Conta a Receber' : 'Conta a Pagar'} - {lancamento.descricao}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Informações Gerais</h3>
              <div className="grid grid-cols-1 gap-3 mt-2">
                <div>
                  <p className="text-sm font-medium text-gray-700">Descrição</p>
                  <p className="text-sm text-gray-900">{lancamento.descricao}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {isReceita ? 'Cooperado' : 'Investidor'}
                  </p>
                  <p className="text-sm text-gray-900">
                    {isReceita 
                      ? lancamento.cooperado?.nome 
                      : lancamento.investidor?.nome_investidor}
                  </p>
                </div>

                {isReceita && lancamento.cooperado?.documento && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Documento</p>
                    <p className="text-sm text-gray-900">
                      {formatarDocumento(lancamento.cooperado.documento)}
                    </p>
                  </div>
                )}

                {!isReceita && lancamento.investidor?.documento && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Documento</p>
                    <p className="text-sm text-gray-900">
                      {formatarDocumento(lancamento.investidor.documento)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Dados Financeiros</h3>
              <div className="grid grid-cols-1 gap-3 mt-2">
                <div>
                  <p className="text-sm font-medium text-gray-700">Valor</p>
                  <p className="text-sm text-gray-900 font-semibold">{formatarMoeda(lancamento.valor)}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Vencimento</p>
                  <p className="text-sm text-gray-900">{dataVencimento}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Pagamento</p>
                  <p className="text-sm text-gray-900">{dataPagamento}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  <div className="mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColorClass(lancamento.status)}`}>
                      {lancamento.status.charAt(0).toUpperCase() + lancamento.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {(isReceita && lancamento.fatura) || (!isReceita && lancamento.pagamento_usina) ? (
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {isReceita ? 'Fatura Relacionada' : 'Pagamento Usina Relacionado'}
                </h3>
                <div className="grid grid-cols-1 gap-3 mt-2">
                  {isReceita && lancamento.fatura && (
                    <>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Número da Fatura</p>
                        <p className="text-sm text-gray-900">{lancamento.fatura.numero_fatura}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">UC</p>
                        <p className="text-sm text-gray-900">{lancamento.fatura.unidade_beneficiaria.numero_uc}</p>
                      </div>
                    </>
                  )}

                  {!isReceita && lancamento.pagamento_usina && (
                    <>
                      <div>
                        <p className="text-sm font-medium text-gray-700">UC da Usina</p>
                        <p className="text-sm text-gray-900">
                          {lancamento.pagamento_usina.usina?.unidade_usina?.numero_uc || '-'}
                        </p>
                      </div>
                      {lancamento.pagamento_usina.geracao_kwh !== undefined && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Geração (kWh)</p>
                          <p className="text-sm text-gray-900">{lancamento.pagamento_usina.geracao_kwh}</p>
                        </div>
                      )}
                      {lancamento.pagamento_usina.valor_total !== undefined && (
                        <div>
                          <p className="text-sm font-medium text-gray-700">Valor Total</p>
                          <p className="text-sm text-gray-900">{formatarMoeda(lancamento.pagamento_usina.valor_total)}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ) : null}

            <div>
              <h3 className="text-sm font-medium text-gray-500">Observação</h3>
              <p className="text-sm text-gray-900 mt-2">
                {lancamento.observacao || "Nenhuma observação cadastrada."}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Histórico de Status</h3>
              <HistoricoStatusList historico={lancamento.historico_status} />
            </div>
          </div>
        </div>

        <div className="mt-6 border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Alterar Status</h3>
          <StatusTransitionButtons 
            lancamento={lancamento}
            onUpdateStatus={onUpdateStatus}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getStatusColorClass(status: StatusLancamento): string {
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
}
