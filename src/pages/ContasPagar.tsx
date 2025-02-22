
import { useLancamentosFinanceiros } from "@/hooks/lancamentos/useLancamentosFinanceiros";
import { FilterBar } from "@/components/shared/FilterBar";
import { StatusLancamento } from "@/types/financeiro";
import { useIsMobile } from "@/hooks/use-mobile";
import { LancamentosTable } from "@/components/financeiro/table/LancamentosTable";
import { LancamentosCards } from "@/components/financeiro/cards/LancamentosCards";
import { LancamentosDashboard } from "@/components/financeiro/dashboard/LancamentosDashboard";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function ContasPagar() {
  const [status, setStatus] = useState<StatusLancamento | 'todos'>('todos');
  const [busca, setBusca] = useState('');
  const isMobile = useIsMobile();

  const { data: lancamentos, isLoading } = useLancamentosFinanceiros({
    tipo: 'despesa',
    status,
    busca,
  });

  const handleLimparFiltros = () => {
    setStatus('todos');
    setBusca('');
  };

  return (
    <div className="space-y-6">
      <h1 className={`text-${isMobile ? '2xl' : '3xl'} font-bold`}>
        Contas a Pagar
      </h1>

      <LancamentosDashboard lancamentos={lancamentos} />

      <FilterBar
        busca={busca}
        onBuscaChange={setBusca}
        onLimparFiltros={handleLimparFiltros}
        placeholder="Buscar por descrição..."
      >
        <div className="w-full sm:w-48">
          <Label htmlFor="status">Status</Label>
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as StatusLancamento | 'todos')}
          >
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="pago">Pago</SelectItem>
                <SelectItem value="atrasado">Atrasado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </FilterBar>

      {isMobile ? (
        <LancamentosCards
          lancamentos={lancamentos}
          isLoading={isLoading}
          tipo="despesa"
        />
      ) : (
        <LancamentosTable
          lancamentos={lancamentos}
          isLoading={isLoading}
          tipo="despesa"
        />
      )}
    </div>
  );
}
