
import { FilterBar } from "@/components/shared/FilterBar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Settings2 } from "lucide-react";

interface UsinaFilterBarProps {
  busca: string;
  onBuscaChange: (value: string) => void;
  onLimparFiltros: () => void;
  colunas: {
    id: string;
    label: string;
    visible: boolean;
  }[];
  onToggleColuna: (id: string) => void;
}

export function UsinaFilterBar({
  busca,
  onBuscaChange,
  onLimparFiltros,
  colunas,
  onToggleColuna,
}: UsinaFilterBarProps) {
  return (
    <FilterBar
      busca={busca}
      onBuscaChange={onBuscaChange}
      onLimparFiltros={onLimparFiltros}
      placeholder="Buscar por investidor, número UC..."
    >
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-10">
              <Settings2 className="h-4 w-4 mr-2" />
              Colunas
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Mostrar/Ocultar Colunas</h4>
              <div className="space-y-2">
                {colunas.map((coluna) => (
                  <div key={coluna.id} className="flex items-center justify-between">
                    <Label htmlFor={coluna.id} className="text-sm">
                      {coluna.label}
                    </Label>
                    <Switch
                      id={coluna.id}
                      checked={coluna.visible}
                      onCheckedChange={() => onToggleColuna(coluna.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </FilterBar>
  );
}
