
/**
 * Componente de cabeçalho para detalhes de lançamento no modal de pagamento
 * 
 * Exibe informações completas sobre o lançamento financeiro no modal
 * de registro de pagamento, incluindo informações de identificação e valores.
 */
import { LancamentoFinanceiro } from "@/types/financeiro";
import { formatarMoeda } from "@/utils/formatters";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertTriangle, Calendar, FileText, User } from "lucide-react";

interface LancamentoDetailsHeaderProps {
  lancamento: LancamentoFinanceiro;
}

export function LancamentoDetailsHeader({ lancamento }: LancamentoDetailsHeaderProps) {
  // Obter informações do contato (cooperado ou investidor)
  const getNomeContato = () => {
    if (lancamento.tipo === 'receita') {
      return lancamento.cooperado?.nome || '-';
    } else {
      return lancamento.investidor?.nome_investidor || '-';
    }
  };

  // Obter documento do contato
  const getDocumentoContato = () => {
    if (lancamento.tipo === 'receita') {
      return lancamento.cooperado?.documento || '-';
    } else {
      return lancamento.investidor?.documento || '-';
    }
  };

  // Obter o mês de referência quando disponível
  const getMesReferencia = () => {
    if (lancamento.fatura?.mes && lancamento.fatura?.ano) {
      return format(new Date(lancamento.fatura.ano, lancamento.fatura.mes - 1), "MMMM/yyyy", { locale: ptBR });
    } else if (lancamento.pagamento_usina?.mes && lancamento.pagamento_usina?.ano) {
      return format(new Date(lancamento.pagamento_usina.ano, lancamento.pagamento_usina.mes - 1), "MMMM/yyyy", { locale: ptBR });
    }
    return null;
  };

  // Verificar se está atrasado
  const isAtrasado = () => {
    if (lancamento.status === 'atrasado') return true;
    if (lancamento.status !== 'pendente') return false;
    
    const hoje = new Date();
    const dataVencimento = new Date(lancamento.data_vencimento);
    return dataVencimento < hoje;
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium">{lancamento.descricao}</h3>
          {getMesReferencia() && (
            <p className="text-sm text-muted-foreground">
              Referência: {getMesReferencia()}
            </p>
          )}
        </div>
        <div className="text-right">
          <div className="text-lg font-bold">{formatarMoeda(lancamento.valor)}</div>
          <div className="text-sm text-muted-foreground">Valor Original</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t">
        <div className="flex items-center gap-2">
          <User size={16} className="text-gray-500" />
          <div>
            <div className="font-medium">{getNomeContato()}</div>
            <div className="text-sm text-muted-foreground">{getDocumentoContato()}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-500" />
          <div>
            <div className="font-medium">{format(new Date(lancamento.data_vencimento), "dd/MM/yyyy", { locale: ptBR })}</div>
            <div className="text-sm text-muted-foreground">Vencimento</div>
          </div>
        </div>
      </div>
      
      {lancamento.observacao && (
        <div className="flex items-start gap-2 pt-2 text-sm">
          <FileText size={16} className="text-gray-500 mt-0.5" />
          <div>{lancamento.observacao}</div>
        </div>
      )}
      
      {isAtrasado() && (
        <div className="flex items-center gap-2 py-2 px-3 bg-amber-50 text-amber-700 rounded-md mt-2">
          <AlertTriangle size={16} />
          <span className="text-sm">
            {lancamento.status === 'atrasado' 
              ? "Este lançamento está atrasado" 
              : "O vencimento deste lançamento já passou"}
          </span>
        </div>
      )}
      
      {/* Informações adicionais específicas do tipo de lançamento */}
      {(lancamento.fatura || lancamento.pagamento_usina) && (
        <div className="mt-2 pt-3 border-t">
          {lancamento.fatura && (
            <div className="text-sm space-y-1">
              <div className="font-medium">Fatura</div>
              <div>UC: {lancamento.fatura.unidade_beneficiaria?.numero_uc || '-'}</div>
              {lancamento.fatura.unidade_beneficiaria?.apelido && (
                <div>Unidade: {lancamento.fatura.unidade_beneficiaria.apelido}</div>
              )}
            </div>
          )}
          
          {lancamento.pagamento_usina && (
            <div className="text-sm space-y-1">
              <div className="font-medium">Pagamento de Usina</div>
              {lancamento.pagamento_usina.usina?.unidade_usina?.numero_uc && (
                <div>UC: {lancamento.pagamento_usina.usina.unidade_usina.numero_uc}</div>
              )}
              {lancamento.pagamento_usina.geracao_kwh && (
                <div>Geração: {lancamento.pagamento_usina.geracao_kwh} kWh</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
