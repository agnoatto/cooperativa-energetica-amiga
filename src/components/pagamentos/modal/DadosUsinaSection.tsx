
/**
 * Componente que exibe os dados básicos da usina no modal de edição de pagamentos
 * 
 * Mostra informações como o número da UC e o nome do investidor relacionados
 * ao pagamento que está sendo editado.
 */
import { PagamentoData } from "../types/pagamento";

interface DadosUsinaSectionProps {
  pagamento: PagamentoData | null;
}

export function DadosUsinaSection({ pagamento }: DadosUsinaSectionProps) {
  if (!pagamento) return null;
  
  return (
    <div className="col-span-2 mb-2">
      <h3 className="text-lg font-medium">Dados da Usina</h3>
      <p className="text-sm text-muted-foreground">
        {pagamento?.usina?.unidade_usina?.numero_uc} - {pagamento?.usina?.investidor?.nome_investidor}
      </p>
    </div>
  );
}
