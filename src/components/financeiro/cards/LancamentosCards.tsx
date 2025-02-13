
import { format } from "date-fns";
import { Eye, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LancamentoFinanceiro } from "@/types/financeiro";
import { formatarMoeda } from "@/utils/formatters";
import { getStatusColor } from "../utils/status";

interface LancamentosCardsProps {
  lancamentos?: LancamentoFinanceiro[];
  isLoading: boolean;
  tipo: 'receita' | 'despesa';
}

export function LancamentosCards({ lancamentos, isLoading, tipo }: LancamentosCardsProps) {
  const getNomeEntidade = (lancamento: LancamentoFinanceiro) => {
    if (tipo === 'receita') {
      return lancamento.cooperado?.nome;
    }
    return lancamento.investidor?.nome_investidor;
  };

  if (isLoading) {
    return <div className="text-center py-4">Carregando...</div>;
  }

  if (!lancamentos?.length) {
    return <div className="text-center py-4">Nenhum lançamento encontrado</div>;
  }

  return (
    <div className="space-y-4">
      {lancamentos.map((lancamento) => (
        <div
          key={lancamento.id}
          className="bg-white rounded-lg shadow-sm border p-4 space-y-4"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{lancamento.descricao}</h3>
              <p className="text-sm text-gray-500">
                {getNomeEntidade(lancamento)}
              </p>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(lancamento.status)}`}>
              {lancamento.status.charAt(0).toUpperCase() + lancamento.status.slice(1)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Vencimento:</span>
              <br />
              {format(new Date(lancamento.data_vencimento), "dd/MM/yyyy")}
            </div>
            <div>
              <span className="text-gray-500">Valor:</span>
              <br />
              {formatarMoeda(lancamento.valor)}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8"
            >
              <Eye className="h-4 w-4" />
            </Button>
            {(tipo === 'receita' ? lancamento.fatura : lancamento.pagamento_usina) && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8"
              >
                <FileText className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
