/**
 * Componente de barra de filtros com seleção de mês
 * 
 * Este componente estende a funcionalidade da FilterBar padrão
 * com suporte para filtragem por período, mas sem duplicar
 * o seletor de mês na interface.
 */
import { FilterBar } from "@/components/shared/FilterBar";
import { useState } from "react";
import { Column } from "@/components/ui/excel-table/types";

interface FilterBarWithMonthProps {
  busca: string;
  onBuscaChange: (value: string) => void;
  onLimparFiltros: () => void;
  placeholder?: string;
  children?: React.ReactNode;
  showColumnsButton?: boolean;
  columns?: Column[];
  visibleColumns?: string[];
  onColumnVisibilityChange?: (columnId: string, visible: boolean) => void;
  onResetColumns?: () => void;
  onMonthChange?: (date: Date) => void;
}

export function FilterBarWithMonth({
  busca,
  onBuscaChange,
  onLimparFiltros,
  placeholder,
  children,
  showColumnsButton,
  columns,
  visibleColumns,
  onColumnVisibilityChange,
  onResetColumns,
  onMonthChange
}: FilterBarWithMonthProps) {
  // Mantemos a interface com o componente pai, mas sem exibir o seletor duplicado
  
  return (
    <div className="space-y-4">      
      <FilterBar
        busca={busca}
        onBuscaChange={onBuscaChange}
        onLimparFiltros={onLimparFiltros}
        placeholder={placeholder}
        showColumnsButton={showColumnsButton}
        columns={columns}
        visibleColumns={visibleColumns}
        onColumnVisibilityChange={onColumnVisibilityChange}
        onResetColumns={onResetColumns}
      >
        {children}
      </FilterBar>
    </div>
  );
}
