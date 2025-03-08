
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
      } catch (error) {
        console.error("Erro ao carregar configurações da tabela:", error);
      }
    }
    return {
      columnWidths: {},
      visibleColumns: columns.map(col => col.id)
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(settings));
    } catch (error) {
      console.error("Erro ao salvar configurações da tabela:", error);
    }
  }, [settings, storageKey]);

  const handleResize = useCallback((columnId: string, width: number) => {
    setSettings(prev => ({
      ...prev,
      columnWidths: {
        ...prev.columnWidths,
        [columnId]: width
      }
    }));
    onColumnResize?.(columnId, width);
  }, [onColumnResize]);

  // Filtrar colunas visíveis se a prop for fornecida
  const visibleColumnData = visibleColumns 
    ? columns.filter(col => visibleColumns.includes(col.id))
    : columns;

  return (
    <div className="relative w-full overflow-x-auto shadow-sm border border-gray-200 rounded-lg">
      <table
        className={cn(
          "w-full border-collapse bg-white",
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
            {visibleColumnData.map((column) => (
              <th
                key={column.id}
                className="px-3 py-3 text-left font-medium border-b border-r border-gray-200 bg-[#F8FAFC] relative"
                style={{
                  width: settings.columnWidths[column.id] || column.width || defaultColumnWidth,
                  minWidth: column.minWidth,
                  maxWidth: column.maxWidth
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="truncate">{column.label}</span>
                </div>
                <ResizeHandle
                  onResize={(width) => handleResize(column.id, width)}
                  minWidth={column.minWidth}
                  maxWidth={column.maxWidth}
                />
              </th>
            ))}
          </tr>
        </thead>
        {children}
      </table>
    </div>
  );
}
