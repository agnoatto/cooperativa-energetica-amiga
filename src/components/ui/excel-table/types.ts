
import { TableHTMLAttributes } from "react";

export interface Column {
  id: string;
  label: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
}

export interface ExcelTableProps extends TableHTMLAttributes<HTMLTableElement> {
  columns: Column[];
  defaultColumnWidth?: number;
  onColumnResize?: (columnId: string, newWidth: number) => void;
  stickyHeader?: boolean;
}
