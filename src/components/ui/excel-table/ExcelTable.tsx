
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Column, ExcelTableProps, TableSettings } from "./types";
import { ResizeHandle } from "./ResizeHandle";
import { ColumnSettings } from "./ColumnSettings";

export function ExcelTable({
  columns,
  children,
  className,
  defaultColumnWidth = 150,
  stickyHeader = true,
  storageKey,
  onColumnResize,
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

  const handleColumnVisibilityChange = useCallback((columnId: string, visible: boolean) => {
    setSettings(prev => ({
      ...prev,
      visibleColumns: visible
        ? [...prev.visibleColumns, columnId]
        : prev.visibleColumns.filter(id => id !== columnId)
    }));
  }, []);

  const handleReset = useCallback(() => {
    setSettings({
      columnWidths: {},
      visibleColumns: columns.map(col => col.id)
    });
  }, [columns]);

  const visibleColumns = columns.filter(col => settings.visibleColumns.includes(col.id));

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ColumnSettings
          columns={columns}
          visibleColumns={settings.visibleColumns}
          onColumnVisibilityChange={handleColumnVisibilityChange}
          onReset={handleReset}
        />
      </div>
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
              {visibleColumns.map((column) => (
                <th
                  key={column.id}
                  className="relative p-3 text-left border-r border-gray-200"
                  style={{
                    width: settings.columnWidths[column.id] || column.width || defaultColumnWidth,
                    minWidth: column.minWidth || 50,
                    maxWidth: column.maxWidth
                  }}
                >
                  {column.label}
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
    </div>
  );
}
