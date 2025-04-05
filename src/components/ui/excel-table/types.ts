
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
  rows: React.ReactNode[];
  defaultColumnWidth?: number;
  onColumnResize?: (columnId: string, newWidth: number) => void;
  stickyHeader?: boolean;
  storageKey: string;
  visibleColumns?: string[];
  onColumnVisibilityChange?: (columnId: string, visible: boolean) => void;
  onResetColumns?: () => void;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  loadingState?: React.ReactNode;
}
