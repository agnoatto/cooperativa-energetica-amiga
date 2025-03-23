
/**
 * Componente para exibição do histórico de status de lançamentos financeiros
 * 
 * Exibe uma lista cronológica de mudanças de status para acompanhamento 
 * de todas as alterações feitas no lançamento, incluindo valores de pagamento,
 * juros e descontos quando aplicáveis.
 */
import { HistoricoStatus } from "@/types/financeiro";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatarMoeda } from "@/utils/formatters";

interface HistoricoStatusListProps {
  historico: HistoricoStatus[] | null;
}

export function HistoricoStatusList({ historico }: HistoricoStatusListProps) {
  if (!historico || historico.length === 0) {
    return <p className="text-sm text-gray-500">Nenhum histórico de status disponível.</p>
  }

  // Ordenar do mais recente para o mais antigo
  const historicoOrdenado = [...historico].sort((a, b) => 
    new Date(b.data).getTime() - new Date(a.data).getTime()
  );

  return (
    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
      {historicoOrdenado.map((item, index) => (
        <div 
          key={index} 
          className="flex flex-col gap-1 border-l-2 border-l-gray-300 pl-3 py-1"
        >
          <div className="flex items-start gap-2 text-sm">
            <div className="flex-1">
              <p className="font-medium">
                <span className="text-gray-700">{item.status_anterior}</span>
                {" → "}
                <span className="text-gray-900">{item.novo_status}</span>
              </p>
              <p className="text-xs text-gray-500">
                {format(new Date(item.data), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>
          </div>
          
          {item.valor_pago !== undefined && (
            <div className="mt-1 pl-2 text-xs">
              <p className="text-green-600">
                Valor pago: {formatarMoeda(item.valor_pago)}
              </p>
              
              {item.valor_juros !== undefined && item.valor_juros > 0 && (
                <p className="text-red-600">
                  Juros: {formatarMoeda(item.valor_juros)}
                </p>
              )}
              
              {item.valor_desconto !== undefined && item.valor_desconto > 0 && (
                <p className="text-green-600">
                  Desconto: {formatarMoeda(item.valor_desconto)}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
