
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusLancamento } from "@/types/financeiro";
import { Search, X } from "lucide-react";

interface FiltrosLancamentoProps {
  status: StatusLancamento | 'todos';
  dataInicio: string;
  dataFim: string;
  busca: string;
  onStatusChange: (value: StatusLancamento | 'todos') => void;
  onDataInicioChange: (value: string) => void;
  onDataFimChange: (value: string) => void;
  onBuscaChange: (value: string) => void;
  onLimparFiltros: () => void;
}

export function FiltrosLancamento({
  status,
  dataInicio,
  dataFim,
  busca,
  onStatusChange,
  onDataInicioChange,
  onDataFimChange,
  onBuscaChange,
  onLimparFiltros,
}: FiltrosLancamentoProps) {
  return (
    <div className="bg-white p-4 rounded-lg border space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="busca">Buscar</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="busca"
              placeholder="Buscar por descrição..."
              value={busca}
              onChange={(e) => onBuscaChange(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="w-full sm:w-48">
          <Label htmlFor="status">Status</Label>
          <Select
            value={status}
            onValueChange={(value) => onStatusChange(value as StatusLancamento | 'todos')}
          >
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="pago">Pago</SelectItem>
              <SelectItem value="atrasado">Atrasado</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-40">
          <Label htmlFor="data-inicio">Data Início</Label>
          <Input
            id="data-inicio"
            type="date"
            value={dataInicio}
            onChange={(e) => onDataInicioChange(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-40">
          <Label htmlFor="data-fim">Data Fim</Label>
          <Input
            id="data-fim"
            type="date"
            value={dataFim}
            onChange={(e) => onDataFimChange(e.target.value)}
          />
        </div>

        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={onLimparFiltros}
            className="w-full sm:w-auto"
          >
            <X className="h-4 w-4 mr-2" />
            Limpar
          </Button>
        </div>
      </div>
    </div>
  );
}
