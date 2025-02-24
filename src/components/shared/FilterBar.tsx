
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, X } from "lucide-react";
import { ColumnSettings } from "@/components/ui/excel-table/ColumnSettings";
import { Column } from "@/components/ui/excel-table/types";

interface FilterBarProps {
  busca: string;
  onBuscaChange: (value: string) => void;
  onLimparFiltros: () => void;
  placeholder?: string;
  children?: React.ReactNode;
  showColumnsButton?: boolean;
  columns?: Column[];
  visibleColumns?: string[];
  onColumnVisibilityChange?: (columnId: string, visible: boolean) => void;
  onResetColumns?: () => void;
}

export function FilterBar({
  busca,
  onBuscaChange,
  onLimparFiltros,
  placeholder = "Buscar...",
  children,
  showColumnsButton,
  columns,
  visibleColumns,
  onColumnVisibilityChange,
  onResetColumns
}: FilterBarProps) {
  return (
    <div className="bg-white p-4 rounded-lg border space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="busca">Buscar</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="busca"
              placeholder={placeholder}
              value={busca}
              onChange={(e) => onBuscaChange(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {children}

        <div className="flex items-end gap-2">
          {showColumnsButton && columns && visibleColumns && onColumnVisibilityChange && (
            <ColumnSettings
              columns={columns}
              visibleColumns={visibleColumns}
              onColumnVisibilityChange={onColumnVisibilityChange}
              onReset={onResetColumns}
            />
          )}
          <Button
            variant="outline"
            onClick={onLimparFiltros}
            className="w-full sm:w-auto"
          >
            <X className="h-4 w-4 mr-2" />
            Limpar
          </Button>
        </div>
      </div>
    </div>
  );
}
