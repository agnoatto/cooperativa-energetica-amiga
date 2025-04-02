
/**
 * Componente para configuração de colunas visíveis
 * 
 * Este componente oferece uma interface para o usuário selecionar
 * quais colunas devem ser exibidas na tabela, melhorando a experiência
 * ao permitir personalização da visualização dos dados.
 */
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Settings } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Column } from "./types";

interface ColumnSettingsProps {
  columns: Column[];
  visibleColumns: string[];
  onColumnVisibilityChange: (columnId: string, visible: boolean) => void;
  onReset: () => void;
}

export function ColumnSettings({
  columns,
  visibleColumns,
  onColumnVisibilityChange,
  onReset,
}: ColumnSettingsProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto">
          <Settings className="h-4 w-4" />
          <span className="ml-2">Colunas</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[200px]">
        <div className="space-y-4">
          <div className="space-y-2">
            {columns.map((column) => (
              <div key={column.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`column-${column.id}`}
                  checked={visibleColumns.includes(column.id)}
                  onCheckedChange={(checked) =>
                    onColumnVisibilityChange(column.id, checked as boolean)
                  }
                />
                <label
                  htmlFor={`column-${column.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {column.label}
                </label>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={onReset} className="w-full">
            Restaurar Padrão
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
