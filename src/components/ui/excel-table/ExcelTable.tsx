
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
  className,
  defaultColumnWidth = 150,
  stickyHeader = true,
  storageKey,
  onColumnResize,
  visibleColumns,
  onColumnVisibilityChange,
  onResetColumns,
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

  return (
    <div className="relative w-full overflow-x-auto shadow-sm border border-gray-200 rounded-lg">
      <table
        className={cn(
          "w-full table-fixed border-collapse bg-white",
          "text-sm [&_th]:bg-[#F8FAFC] [&_th]:font-medium [&_th]:text-gray-700",
          "[&_td]:p-3 [&_td]:text-gray-700 [&_td]:border-0 [&_td]:border-r [&_td]:border-gray-200",
          "[&_tr:hover]:bg-[#F1F5F9]",
          "[&_tr]:border-b [&_tr]:border-gray-200 last:[&_tr]:border-0",
          className
        )}
        {...props}
      >
        <thead className={cn(stickyHeader && "sticky top-0 z-10")}>
          <tr>
            {columns.map((column) => {
              // Obtém a largura salva ou usa o padrão
              const columnWidth = settings.columnWidths[column.id] || column.width || defaultColumnWidth;
              
              return (
                <th
                  key={column.id}
                  className="px-3 py-3 text-left font-medium border-b border-r border-gray-200 bg-[#F8FAFC] relative select-none"
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
      </table>
    </div>
  );
}
