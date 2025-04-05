
/**
 * Componente de tabela no estilo Excel
 * 
 * Esta tabela implementa funcionalidades similares ao Excel como
 * redimensionamento de colunas, rolagem horizontal, cabeçalhos fixos
 * e outras funcionalidades avançadas para melhor experiência do usuário.
 */
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Column, ExcelTableProps, TableSettings } from "./types";
import { ResizeHandle } from "./ResizeHandle";

export function ExcelTable({
  columns,
  children,
  rows,
  className,
  defaultColumnWidth = 150,
  stickyHeader = true,
  storageKey,
  onColumnResize,
  visibleColumns,
  onColumnVisibilityChange,
  onResetColumns,
  isLoading,
  emptyState,
  loadingState,
  ...props
}: ExcelTableProps) {
  const [settings, setSettings] = useState<TableSettings>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Erro ao carregar configurações da tabela:", e);
        return {
          columnWidths: {},
          visibleColumns: columns.map(col => col.id)
        };
      }
    }
    return {
      columnWidths: {},
      visibleColumns: columns.map(col => col.id)
    };
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(settings));
  }, [settings, storageKey]);

  const handleResize = useCallback((columnId: string, width: number) => {
    console.log(`Redimensionando coluna ${columnId} para ${width}px`);
    setSettings(prev => ({
      ...prev,
      columnWidths: {
        ...prev.columnWidths,
        [columnId]: width
      }
    }));
    onColumnResize?.(columnId, width);
  }, [onColumnResize]);

  // Renderizar estado de carregamento se fornecido e isLoading for true
  if (isLoading && loadingState) {
    return loadingState;
  }

  // Renderizar estado vazio se fornecido e não houver rows nem children
  if (emptyState && !rows?.length && !children) {
    return emptyState;
  }

  return (
    <div className="relative w-full overflow-x-auto shadow-sm border border-gray-200 rounded-lg">
      <table
        className={cn(
          "w-full table-fixed border-collapse bg-white",
          "text-sm [&_th]:bg-[#F8FAFC] [&_th]:font-medium [&_th]:text-gray-700",
          "[&_td]:p-3 [&_td]:text-gray-700 [&_td]:border-0 [&_td]:border-r [&_td]:border-gray-200",
          "[&_tr:nth-child(even)]:bg-[#F9FAFB]", // Linhas zebradas
          "[&_tr:hover]:bg-[#F1F5F9]",
          "[&_tr]:border-b [&_tr]:border-gray-200 last:[&_tr]:border-0",
          className
        )}
        {...props}
      >
        <thead className={cn(stickyHeader && "sticky top-0 z-10")}>
          <tr>
            {columns.map((column, index) => {
              // Obtém a largura salva ou usa o padrão
              const columnWidth = settings.columnWidths[column.id] || column.width || defaultColumnWidth;
              
              // Primeira coluna fixa
              const isFirstColumn = index === 0;
              
              return (
                <th
                  key={column.id}
                  className={cn(
                    "px-3 py-3 text-left font-medium border-b border-r border-gray-200 bg-[#F1F5F9] relative select-none",
                    isFirstColumn && "sticky left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]" // Coluna fixa com sombra
                  )}
                  style={{
                    width: columnWidth,
                    minWidth: column.minWidth || 50,
                    maxWidth: column.maxWidth
                  }}
                >
                  <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
                    <span className="truncate">{column.label}</span>
                  </div>
                  <ResizeHandle
                    onResize={(width) => handleResize(column.id, width)}
                    minWidth={column.minWidth}
                    maxWidth={column.maxWidth}
                  />
                </th>
              );
            })}
          </tr>
        </thead>
        {children}
        {rows && !children && (
          <tbody>
            {rows}
          </tbody>
        )}
      </table>
    </div>
  );
}
