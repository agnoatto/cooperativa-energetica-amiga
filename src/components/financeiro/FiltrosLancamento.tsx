
/**
 * Componente de filtros para lançamentos financeiros
 * 
 * Este componente oferece filtros padrão de ERP para gerenciar
 * lançamentos financeiros, incluindo filtros por status, período,
 * e busca textual.
 */
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
import { Search, X, Filter, Calendar, Users, FileText } from "lucide-react";

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
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <div className="bg-white p-4 rounded-lg border space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b mb-3">
        <Filter className="h-5 w-5 text-gray-500" />
        <h3 className="font-medium text-gray-800">Filtros de Lançamentos</h3>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="busca" className="flex items-center gap-1">
            <Search className="h-4 w-4 text-gray-500" />
            Buscar
          </Label>
          <div className="relative">
            <Input
              id="busca"
              placeholder="Buscar por descrição, nome, documento, UC..."
              value={busca}
              onChange={(e) => onBuscaChange(e.target.value)}
              className="pl-8"
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Busca em: descrição, nome, documento, Unidade Consumidora
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-48">
          <Label htmlFor="status" className="flex items-center gap-1">
            <FileText className="h-4 w-4 text-gray-500" />
            Status
          </Label>
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
          <Label htmlFor="data-inicio" className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-gray-500" />
            Data Início
          </Label>
          <Input
            id="data-inicio"
            type="date"
            value={dataInicio}
            onChange={(e) => onDataInicioChange(e.target.value)}
            max={dataFim || today}
          />
        </div>

        <div className="w-full sm:w-40">
          <Label htmlFor="data-fim" className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-gray-500" />
            Data Fim
          </Label>
          <Input
            id="data-fim"
            type="date"
            value={dataFim}
            onChange={(e) => onDataFimChange(e.target.value)}
            min={dataInicio}
            max={today}
          />
        </div>

        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={onLimparFiltros}
            className="w-full sm:w-auto"
          >
            <X className="h-4 w-4 mr-2" />
            Limpar Filtros
          </Button>
        </div>
      </div>
    </div>
  );
}
