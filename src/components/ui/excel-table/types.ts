
import { TableHTMLAttributes } from "react";

export interface Column {
  id: string;
  label: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  visible?: boolean;
}

export interface TableSettings {
  columnWidths: Record<string, number>;
  visibleColumns: string[];
}

export interface ExcelTableProps extends TableHTMLAttributes<HTMLTableElement> {
  columns: Column[];
  defaultColumnWidth?: number;
  onColumnResize?: (columnId: string, newWidth: number) => void;
  stickyHeader?: boolean;
  storageKey: string;
  visibleColumns?: string[];
  onColumnVisibilityChange?: (columnId: string, visible: boolean) => void;
  onResetColumns?: () => void;
}
