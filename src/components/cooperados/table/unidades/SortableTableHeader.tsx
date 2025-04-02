
/**
 * Componente para cabeçalhos de tabela ordenáveis
 * 
 * Este componente renderiza um cabeçalho de tabela com indicadores visuais
 * de ordenação, permitindo ao usuário clicar para alternar entre diferentes
 * estados de ordenação.
 */
import { ChevronUp, ChevronDown } from "lucide-react";
import { SortDirection, SortField } from "./useUnidadesSorting";

interface SortableTableHeaderProps {
  field: SortField;
  title: string;
  currentSortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  className?: string;
}

export function SortableTableHeader({
  field,
  title,
  currentSortField,
  sortDirection,
  onSort,
  className = ""
}: SortableTableHeaderProps) {
  // Componente para o indicador de ordenação
  const SortIndicator = () => {
    if (currentSortField !== field) return null;
    
    if (sortDirection === 'asc') {
      return <ChevronUp className="h-4 w-4 ml-1" />;
    }
    
    if (sortDirection === 'desc') {
      return <ChevronDown className="h-4 w-4 ml-1" />;
    }
    
    return null;
  };

  // Estilo para cabeçalhos ordenáveis
  const getSortableHeaderStyle = () => {
    return `flex items-center ${currentSortField === field ? 'text-primary' : ''} cursor-pointer hover:text-primary transition-colors ${className}`;
  };

  return (
    <div 
      className={getSortableHeaderStyle()}
      onClick={() => onSort(field)}
    >
      {title}
      <SortIndicator />
    </div>
  );
}
