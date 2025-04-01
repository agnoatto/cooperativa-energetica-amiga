
/**
 * Componente de barra de filtros com seleção de mês
 * 
 * Este componente estende a funcionalidade da FilterBar padrão
 * adicionando um seletor de mês que permite a navegação entre períodos.
 * Útil para filtragem de dados financeiros e relatórios por período.
 */
import { FilterBar } from "@/components/shared/FilterBar";
import { MonthSelector } from "@/components/MonthSelector";
import { useState } from "react";
import { useMonthSelection } from "@/hooks/useMonthSelection";
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
  const { 
    selectedDate, 
    handlePreviousMonth, 
    handleNextMonth: nextMonth 
  } = useMonthSelection();

  // Propagar a mudança de mês para o componente pai se necessário
  const handlePrevMonth = () => {
    handlePreviousMonth();
    if (onMonthChange) {
      onMonthChange(selectedDate);
    }
  };

  const handleNextMonth = () => {
    nextMonth();
    if (onMonthChange) {
      onMonthChange(selectedDate);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center mb-2">
        <MonthSelector 
          currentDate={selectedDate}
          onPreviousMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
      </div>
      
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
