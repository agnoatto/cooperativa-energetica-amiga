
/**
 * Hook para gerenciamento de colunas da tabela de lançamentos financeiros
 * 
 * Este hook gerencia o estado das colunas visíveis, larguras e
 * persistência das configurações no localStorage, facilitando o
 * reuso desta lógica.
 */
import { useState, useEffect } from "react";
import { Column } from "@/components/ui/excel-table/types";
import { defaultColumns } from "../config/defaultColumns";

export interface UseTableColumnsProps {
  storageKeyPrefix?: string;
  tipoLancamento?: 'receita' | 'despesa';
}

export function useTableColumns({
  storageKeyPrefix = 'lancamentos',
  tipoLancamento = 'receita'
}: UseTableColumnsProps = {}) {
  const visibilityKey = `${storageKeyPrefix}-${tipoLancamento}-columns-visibility`;
  const widthsKey = `${storageKeyPrefix}-${tipoLancamento}-column-widths`;
  
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
    setColumnWidths(prev => ({
      ...prev,
      [columnId]: width
    }));
  };

  // Colunas filtradas com base nas colunas visíveis
  const filteredColumns = defaultColumns.filter(col => 
    visibleColumns.includes(col.id)
  );

  // Ajustar rótulo da coluna de contato conforme o tipo de lançamento
  const columns = filteredColumns.map(col => {
    if (col.id === 'contato') {
      return {
        ...col,
        label: tipoLancamento === 'receita' ? 'Cooperado' : 'Investidor'
      };
    }
    return col;
  });

  return {
    visibleColumns,
    columnWidths,
    columns,
    handleColumnVisibilityChange,
    handleResetColumns,
    handleColumnResize
  };
}
