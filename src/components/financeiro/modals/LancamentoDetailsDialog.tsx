
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
import { Badge } from "@/components/ui/badge";
import { Calendar, Phone, Mail, User, FileText, MapPin, CreditCard } from "lucide-react";

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

  // Extrair informações de mês/ano da fatura se disponível
  const extrairMesAnoFatura = () => {
    if (lancamento.fatura) {
      // Tentar extrair o mês e ano do número da fatura
      const numeroFatura = lancamento.fatura.numero_fatura;
      const match = numeroFatura.match(/(\d{2})\/(\d{4})/);
      if (match) {
        return {
          mes: match[1],
          ano: match[2]
        };
      }
    }
    return null;
  };

  const mesAnoFatura = extrairMesAnoFatura();

  // Função auxiliar para renderizar item de informação
  const InfoItem = ({ icon, label, value, className = "" }) => (
    <div className={`flex items-start space-x-2 ${className}`}>
      {icon && <span className="text-muted-foreground mt-0.5">{icon}</span>}
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-sm text-gray-900">{value || "-"}</p>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Detalhes do Lançamento</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <span className="font-medium">
              {isReceita ? 'Conta a Receber' : 'Conta a Pagar'}
            </span>
            <span> - </span>
            <span>{lancamento.descricao}</span>
            {mesAnoFatura && (
              <>
                <span> - </span>
                <Badge variant="outline" className="ml-2">
                  Referência: {mesAnoFatura.mes}/{mesAnoFatura.ano}
                </Badge>
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                <User className="h-4 w-4" />
                {isReceita ? 'Dados do Cooperado' : 'Dados do Investidor'}
              </h3>
              
              <div className="space-y-3">
                {isReceita && lancamento.cooperado ? (
                  <>
                    <InfoItem 
                      icon={<User className="h-4 w-4" />}
                      label="Nome Completo"
                      value={lancamento.cooperado.nome}
                    />
                    
                    {lancamento.cooperado.documento && (
                      <InfoItem 
                        icon={<CreditCard className="h-4 w-4" />}
                        label="CPF/CNPJ"
                        value={formatarDocumento(lancamento.cooperado.documento)}
                      />
                    )}
                    
                    {lancamento.cooperado.telefone && (
                      <InfoItem 
                        icon={<Phone className="h-4 w-4" />}
                        label="Telefone"
                        value={lancamento.cooperado.telefone}
                      />
                    )}
                    
                    {lancamento.cooperado.email && (
                      <InfoItem 
                        icon={<Mail className="h-4 w-4" />}
                        label="E-mail"
                        value={lancamento.cooperado.email}
                      />
                    )}
                    
                    {lancamento.cooperado.numero_cadastro && (
                      <InfoItem 
                        icon={<FileText className="h-4 w-4" />}
                        label="Número de Cadastro"
                        value={lancamento.cooperado.numero_cadastro}
                      />
                    )}
                  </>
                ) : !isReceita && lancamento.investidor ? (
                  <>
                    <InfoItem 
                      icon={<User className="h-4 w-4" />}
                      label="Nome do Investidor"
                      value={lancamento.investidor.nome_investidor}
                    />
                    
                    {lancamento.investidor.documento && (
                      <InfoItem 
                        icon={<CreditCard className="h-4 w-4" />}
                        label="CPF/CNPJ"
                        value={formatarDocumento(lancamento.investidor.documento)}
                      />
                    )}
                    
                    {lancamento.investidor.telefone && (
                      <InfoItem 
                        icon={<Phone className="h-4 w-4" />}
                        label="Telefone"
                        value={lancamento.investidor.telefone}
                      />
                    )}
                    
                    {lancamento.investidor.email && (
                      <InfoItem 
                        icon={<Mail className="h-4 w-4" />}
                        label="E-mail"
                        value={lancamento.investidor.email}
                      />
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-500">Dados não disponíveis.</p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4" />
                Dados Financeiros
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <InfoItem
                  label="Valor"
                  value={formatarMoeda(lancamento.valor)}
                  className="col-span-2"
                />
                
                <InfoItem
                  label="Data de Criação"
                  value={dataCriacao}
                />
                
                <InfoItem
                  label="Vencimento"
                  value={dataVencimento}
                />
                
                <InfoItem
                  label="Pagamento"
                  value={dataPagamento}
                />
                
                <InfoItem
                  label="Status"
                  value={
                    <Badge 
                      className={`mt-1 ${getStatusColorClass(lancamento.status)}`}>
                      {lancamento.status.charAt(0).toUpperCase() + lancamento.status.slice(1)}
                    </Badge>
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {isReceita && lancamento.fatura ? (
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4" />
                  Fatura Relacionada
                </h3>
                
                <div className="space-y-3">
                  <InfoItem
                    label="Número da Fatura"
                    value={lancamento.fatura.numero_fatura}
                  />
                  
                  <InfoItem
                    label="Unidade Consumidora"
                    value={lancamento.fatura.unidade_beneficiaria?.numero_uc}
                  />
                  
                  {lancamento.fatura.unidade_beneficiaria?.apelido && (
                    <InfoItem
                      label="Apelido da UC"
                      value={lancamento.fatura.unidade_beneficiaria.apelido}
                    />
                  )}
                  
                  {lancamento.fatura.unidade_beneficiaria?.endereco && (
                    <InfoItem
                      icon={<MapPin className="h-4 w-4" />}
                      label="Endereço"
                      value={lancamento.fatura.unidade_beneficiaria.endereco}
                    />
                  )}
                  
                  {lancamento.fatura.mes !== undefined && lancamento.fatura.ano !== undefined && (
                    <InfoItem
                      icon={<Calendar className="h-4 w-4" />}
                      label="Referência"
                      value={`${lancamento.fatura.mes}/${lancamento.fatura.ano}`}
                    />
                  )}
                </div>
              </div>
            ) : !isReceita && lancamento.pagamento_usina ? (
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4" />
                  Pagamento de Usina Relacionado
                </h3>
                
                <div className="space-y-3">
                  {lancamento.pagamento_usina.usina?.unidade_usina?.numero_uc && (
                    <InfoItem
                      label="UC da Usina"
                      value={lancamento.pagamento_usina.usina.unidade_usina.numero_uc}
                    />
                  )}
                  
                  {lancamento.pagamento_usina.mes !== undefined && lancamento.pagamento_usina.ano !== undefined && (
                    <InfoItem
                      icon={<Calendar className="h-4 w-4" />}
                      label="Referência"
                      value={`${lancamento.pagamento_usina.mes}/${lancamento.pagamento_usina.ano}`}
                    />
                  )}
                  
                  {lancamento.pagamento_usina.geracao_kwh !== undefined && (
                    <InfoItem
                      label="Geração (kWh)"
                      value={`${lancamento.pagamento_usina.geracao_kwh} kWh`}
                    />
                  )}
                  
                  {lancamento.pagamento_usina.valor_total !== undefined && (
                    <InfoItem
                      label="Valor Total"
                      value={formatarMoeda(lancamento.pagamento_usina.valor_total)}
                    />
                  )}
                </div>
              </div>
            ) : null}

            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Observação</h3>
              {lancamento.observacao ? (
                <p className="text-sm text-gray-900 p-2 bg-white rounded border border-gray-100">
                  {lancamento.observacao}
                </p>
              ) : (
                <p className="text-sm text-gray-500 italic">Nenhuma observação cadastrada.</p>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Histórico de Status</h3>
              {lancamento.historico_status && lancamento.historico_status.length > 0 ? (
                <HistoricoStatusList historico={lancamento.historico_status} />
              ) : (
                <p className="text-sm text-gray-500 italic">Nenhum histórico de status disponível.</p>
              )}
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
