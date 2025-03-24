
/**
 * Componente de informações básicas do lançamento
 * 
 * Exibe tipo, status e outras informações essenciais do lançamento
 */
import { LancamentoFinanceiro } from "@/types/financeiro";
import { UserCircle, CalendarIcon, BanknoteIcon, FileTextIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatarMoeda } from "@/utils/formatters";

interface LancamentoInfoBasicaProps {
  lancamento: LancamentoFinanceiro;
}

export function LancamentoInfoBasica({ lancamento }: LancamentoInfoBasicaProps) {
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

  return (
    <>
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
    </>
  );
}
