
/**
 * Componente de informações de origem do lançamento
 * 
 * Exibe detalhes da origem do lançamento (fatura ou pagamento de usina)
 */
import { LancamentoFinanceiro } from "@/types/financeiro";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LancamentoOrigemInfoProps {
  lancamento: LancamentoFinanceiro;
}

export function LancamentoOrigemInfo({ lancamento }: LancamentoOrigemInfoProps) {
  if (lancamento.fatura) {
    return (
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
            Período: {format(new Date(lancamento.fatura.ano, lancamento.fatura.mes - 1), 'MMMM/yyyy', { locale: ptBR })}
          </div>
        )}
      </div>
    );
  } 
  
  if (lancamento.pagamento_usina) {
    const pu = lancamento.pagamento_usina;
    return (
      <div className="mt-4 p-3 bg-amber-50 rounded-md text-sm">
        <div className="font-medium text-amber-800 mb-1">Pagamento de Usina</div>
        {pu.mes && pu.ano && (
          <div className="text-amber-700">
            Período: {format(new Date(pu.ano, pu.mes - 1), 'MMMM/yyyy', { locale: ptBR })}
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
  
  return null;
}
