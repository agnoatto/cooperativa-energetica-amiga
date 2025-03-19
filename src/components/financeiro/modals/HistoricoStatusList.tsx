
/**
 * Componente para exibição do histórico de status de lançamentos financeiros
 * 
 * Exibe uma lista cronológica de mudanças de status para acompanhamento 
 * de todas as alterações feitas no lançamento.
 */
import { HistoricoStatus } from "@/types/financeiro";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
          className="flex items-start gap-2 text-sm border-l-2 border-l-gray-300 pl-3 py-1"
        >
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
      ))}
    </div>
  );
}
