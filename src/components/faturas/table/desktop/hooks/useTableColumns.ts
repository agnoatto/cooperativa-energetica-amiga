
/**
 * Hook para gerenciamento de colunas da tabela de faturas
 * 
 * Este hook gerencia o estado das colunas visíveis, larguras e
 * persistência das configurações no localStorage, facilitando o
 * reuso desta lógica em diferentes contextos.
 */
import { useState, useEffect } from "react";
import { Column } from "@/components/ui/excel-table/types";

interface UseTableColumnsProps {
  defaultColumns: Column[];
  storageKeyPrefix?: string;
}

interface UseTableColumnsResult {
  visibleColumns: string[];
  columnWidths: Record<string, number>;
  filteredColumns: Column[];
  handleColumnVisibilityChange: (columnId: string, visible: boolean) => void;
  handleResetColumns: () => void;
  handleColumnResize: (columnId: string, width: number) => void;
}

export function useTableColumns({
  defaultColumns,
  storageKeyPrefix = 'faturas'
}: UseTableColumnsProps): UseTableColumnsResult {
  const visibilityKey = `${storageKeyPrefix}-columns-visibility`;
  const widthsKey = `${storageKeyPrefix}-column-widths`;
  
  // Estado para colunas visíveis
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    const saved = localStorage.getItem(visibilityKey);
    return saved ? JSON.parse(saved) : defaultColumns.map(col => col.id);
  });

  // Estado para larguras das colunas
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem(widthsKey);
    return saved ? JSON.parse(saved) : {};
  });

  // Persistir alterações no localStorage
  useEffect(() => {
    localStorage.setItem(visibilityKey, JSON.stringify(visibleColumns));
  }, [visibleColumns, visibilityKey]);

  useEffect(() => {
    localStorage.setItem(widthsKey, JSON.stringify(columnWidths));
  }, [columnWidths, widthsKey]);

  // Manipuladores de eventos
  const handleColumnVisibilityChange = (columnId: string, visible: boolean) => {
    setVisibleColumns(prev =>
      visible
        ? [...prev, columnId]
        : prev.filter(id => id !== columnId)
    );
  };

  const handleResetColumns = () => {
    setVisibleColumns(defaultColumns.map(col => col.id));
    setColumnWidths({});
    localStorage.removeItem(widthsKey);
  };

  const handleColumnResize = (columnId: string, width: number) => {
    console.log(`Coluna ${columnId} redimensionada para ${width}px`);
    setColumnWidths(prev => ({
      ...prev,
      [columnId]: width
    }));
  };

  // Colunas filtradas com base nas colunas visíveis
  const filteredColumns = defaultColumns.filter(col => 
    visibleColumns.includes(col.id)
  );

  return {
    visibleColumns,
    columnWidths,
    filteredColumns,
    handleColumnVisibilityChange,
    handleResetColumns,
    handleColumnResize
  };
}
