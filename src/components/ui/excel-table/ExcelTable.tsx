
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ExcelTableProps } from "./types";
import { ResizeHandle } from "./ResizeHandle";

const STORAGE_KEY = "excel-table-column-widths";

export function ExcelTable({
  columns,
  children,
  className,
  defaultColumnWidth = 150,
  stickyHeader = true,
  onColumnResize,
  ...props
}: ExcelTableProps) {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(columnWidths));
  }, [columnWidths]);

  const handleResize = useCallback((columnId: string, width: number) => {
    setColumnWidths(prev => ({ ...prev, [columnId]: width }));
    onColumnResize?.(columnId, width);
  }, [onColumnResize]);

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
            {columns.map((column) => (
              <th
                key={column.id}
                className="relative p-3 text-left border-r border-gray-200"
                style={{
                  width: columnWidths[column.id] || column.width || defaultColumnWidth,
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
  );
}
