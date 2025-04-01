
/**
 * Barra de filtros para cooperados
 * 
 * Componente que permite filtrar cooperados por termo de busca,
 * status (ativo/inativo) e ordenar por diferentes campos.
 */
import { FilterBar } from "@/components/shared/FilterBar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type OrderBy = "nome_asc" | "nome_desc" | "cadastro_asc" | "cadastro_desc" | "tipo_asc" | "tipo_desc";
type StatusFilter = "ativos" | "inativos" | "todos";

interface CooperadosFilterBarProps {
  busca: string;
  onBuscaChange: (value: string) => void;
  orderBy: OrderBy;
  onOrderByChange: (value: OrderBy) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
  onLimparFiltros: () => void;
}

export function CooperadosFilterBar({
  busca,
  onBuscaChange,
  orderBy,
  onOrderByChange,
  statusFilter,
  onStatusFilterChange,
  onLimparFiltros
}: CooperadosFilterBarProps) {
  return (
    <FilterBar
      busca={busca}
      onBuscaChange={onBuscaChange}
      onLimparFiltros={onLimparFiltros}
      placeholder="Buscar por nome, documento ou nº cadastro..."
    >
      <div className="min-w-[180px]">
        <Label htmlFor="statusFilter">Status</Label>
        <Select 
          value={statusFilter} 
          onValueChange={(value) => onStatusFilterChange(value as StatusFilter)}
        >
          <SelectTrigger id="statusFilter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ativos">Ativos</SelectItem>
            <SelectItem value="inativos">Inativos</SelectItem>
            <SelectItem value="todos">Todos</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="min-w-[200px]">
        <Label htmlFor="orderBy">Ordenar por</Label>
        <Select 
          value={orderBy} 
          onValueChange={(value) => onOrderByChange(value as OrderBy)}
        >
          <SelectTrigger id="orderBy">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nome_asc">Nome (A-Z)</SelectItem>
            <SelectItem value="nome_desc">Nome (Z-A)</SelectItem>
            <SelectItem value="cadastro_asc">Nº Cadastro (Crescente)</SelectItem>
            <SelectItem value="cadastro_desc">Nº Cadastro (Decrescente)</SelectItem>
            <SelectItem value="tipo_asc">Tipo (A-Z)</SelectItem>
            <SelectItem value="tipo_desc">Tipo (Z-A)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </FilterBar>
  );
}
