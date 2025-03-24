
/**
 * Diálogo de detalhes do lançamento financeiro
 * 
 * Exibe informações detalhadas sobre o lançamento, com opções
 * para atualizar seu status. A data de vencimento é obtida
 * diretamente da fatura ou pagamento quando disponível.
 */
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { LancamentoFinanceiro } from "@/types/financeiro";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { StatusTransitionButtons } from "../StatusTransitionButtons";
import { formatarMoeda } from "@/utils/formatters";
import { CalendarIcon, BanknoteIcon, FileTextIcon, UserCircle } from "lucide-react";
import { HistoricoStatusList } from "./HistoricoStatusList";
import { Button } from "@/components/ui/button";
import { RegistrarPagamentoDialog } from "./RegistrarPagamentoDialog";
import { useState } from "react";

interface LancamentoDetailsDialogProps {
  lancamento: LancamentoFinanceiro | null;
  isOpen: boolean;
  onClose: () => void;
  onAfterStatusChange?: () => void;
}

export function LancamentoDetailsDialog({
  lancamento,
  isOpen,
  onClose,
  onAfterStatusChange,
}: LancamentoDetailsDialogProps) {
  const [showRegistrarPagamento, setShowRegistrarPagamento] = useState(false);

  if (!lancamento) return null;

  // Função para obter a data de vencimento mais atualizada
  const getDataVencimento = () => {
    // Prioriza a data da fatura/pagamento_usina sobre a data do lançamento
    if (lancamento.fatura?.data_vencimento) {
      return new Date(lancamento.fatura.data_vencimento);
    } else if (lancamento.pagamento_usina?.data_vencimento) {
      return new Date(lancamento.pagamento_usina.data_vencimento);
    }
    
    // Fallback para a data do lançamento
    return new Date(lancamento.data_vencimento);
  };

  // Formatar a data de pagamento se existir
  const dataPagamentoFormatada = lancamento.data_pagamento
    ? format(new Date(lancamento.data_pagamento), "dd/MM/yyyy", { locale: ptBR })
    : "Não realizado";

  // Informações da entidade (cooperado ou investidor)
  const getNomeEntidade = () => {
    return lancamento.tipo === 'receita'
      ? lancamento.cooperado?.nome
      : lancamento.investidor?.nome_investidor;
  };

  const handlePagamentoSuccess = () => {
    setShowRegistrarPagamento(false);
    if (onAfterStatusChange) {
      onAfterStatusChange();
    }
    onClose();
  };

  // Informações sobre a origem do lançamento
  let origemInfo = null;
  if (lancamento.fatura) {
    origemInfo = (
      <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm">
        <div className="font-medium text-blue-800 mb-1">Fatura</div>
        <div className="text-blue-700">
          Número: {lancamento.fatura.numero_fatura || 'N/A'}
        </div>
        <div className="text-blue-700">
          UC: {lancamento.fatura.unidade_beneficiaria?.numero_uc || 'N/A'}
          {lancamento.fatura.unidade_beneficiaria?.apelido && 
            ` (${lancamento.fatura.unidade_beneficiaria.apelido})`}
        </div>
        {lancamento.fatura.mes && lancamento.fatura.ano && (
          <div className="text-blue-700">
            Período: {lancamento.fatura.mes}/{lancamento.fatura.ano}
          </div>
        )}
      </div>
    );
  } else if (lancamento.pagamento_usina) {
    const pu = lancamento.pagamento_usina;
    origemInfo = (
      <div className="mt-4 p-3 bg-amber-50 rounded-md text-sm">
        <div className="font-medium text-amber-800 mb-1">Pagamento de Usina</div>
        {pu.mes && pu.ano && (
          <div className="text-amber-700">
            Período: {pu.mes}/{pu.ano}
          </div>
        )}
        {pu.usina?.unidade_usina && (
          <div className="text-amber-700">
            UC: {pu.usina.unidade_usina.numero_uc}
            {pu.usina.unidade_usina.apelido && 
              ` (${pu.usina.unidade_usina.apelido})`}
          </div>
        )}
        {pu.geracao_kwh && (
          <div className="text-amber-700">
            Geração: {pu.geracao_kwh} kWh
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Lançamento</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <h3 className="font-medium text-lg">{lancamento.descricao}</h3>
              <div className="text-sm text-gray-500">
                Criado em {format(new Date(lancamento.created_at), "dd/MM/yyyy", { locale: ptBR })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="text-sm text-gray-500">Tipo</div>
                <div className="font-medium">
                  {lancamento.tipo === "receita" ? "Receita" : "Despesa"}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500">Status</div>
                <div className="font-medium">
                  {lancamento.status.charAt(0).toUpperCase() + lancamento.status.slice(1)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <UserCircle className="h-4 w-4 text-gray-500" />
              <span>{getNomeEntidade()}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <CalendarIcon className="h-4 w-4 text-gray-500" />
              <span>Vencimento: {format(getDataVencimento(), "dd/MM/yyyy", { locale: ptBR })}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <BanknoteIcon className="h-4 w-4 text-gray-500" />
              <span>Valor: {formatarMoeda(lancamento.valor)}</span>
            </div>

            {lancamento.valor_pago !== null && lancamento.status === 'pago' && (
              <div className="flex items-center gap-2 text-green-700">
                <BanknoteIcon className="h-4 w-4 text-green-500" />
                <span>Valor pago: {formatarMoeda(lancamento.valor_pago)}</span>
              </div>
            )}

            {lancamento.data_pagamento && (
              <div className="flex items-center gap-2 text-gray-700">
                <CalendarIcon className="h-4 w-4 text-gray-500" />
                <span>Data pagamento: {dataPagamentoFormatada}</span>
              </div>
            )}

            {lancamento.observacao && (
              <div className="flex items-start gap-2 text-gray-700">
                <FileTextIcon className="h-4 w-4 text-gray-500 mt-1" />
                <span>Observação: {lancamento.observacao}</span>
              </div>
            )}

            {origemInfo}

            <Separator className="my-3" />

            <div>
              <h4 className="font-medium mb-2">Histórico de Status</h4>
              <HistoricoStatusList historico={lancamento.historico_status} />
            </div>

            <Separator className="my-3" />

            <div className="space-y-3">
              {lancamento.status !== 'pago' && (
                <Button 
                  onClick={() => setShowRegistrarPagamento(true)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <BanknoteIcon className="h-4 w-4 mr-2" />
                  Registrar Pagamento
                </Button>
              )}
              
              <div className="space-y-2">
                <div className="text-sm font-medium">Alterar Status:</div>
                <StatusTransitionButtons 
                  lancamento={lancamento} 
                  onAfterStatusChange={onAfterStatusChange}
                  className="flex-wrap justify-center"
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <RegistrarPagamentoDialog
        lancamento={lancamento}
        isOpen={showRegistrarPagamento}
        onClose={() => setShowRegistrarPagamento(false)}
        onSuccess={handlePagamentoSuccess}
      />
    </>
  );
}
