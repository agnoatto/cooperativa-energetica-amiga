
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
      return JSON.parse(saved);
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
          "w-full border-collapse bg-white",
          "text-sm [&_th]:bg-[#F8FAFC] [&_th]:font-medium [&_th]:text-gray-700",
          "[&_td]:py-2 [&_td]:px-3 [&_td]:text-gray-700 [&_td]:border-0 [&_td]:border-r [&_td]:border-gray-100",
          "[&_tr:hover]:bg-[#F1F5F9]",
          "[&_tr]:border-b [&_tr]:border-gray-100 last:[&_tr]:border-0",
          className
        )}
        {...props}
      >
        <thead className={cn(stickyHeader && "sticky top-0 z-10")}>
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                className="px-3 py-2 text-left font-medium border-b border-r border-gray-100 bg-[#F8FAFC] relative"
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
