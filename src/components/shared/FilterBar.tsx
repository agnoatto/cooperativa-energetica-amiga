
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, X } from "lucide-react";

interface FilterBarProps {
  busca: string;
  onBuscaChange: (value: string) => void;
  onLimparFiltros: () => void;
  placeholder?: string;
  children?: React.ReactNode;
}

export function FilterBar({
  busca,
  onBuscaChange,
  onLimparFiltros,
  placeholder = "Buscar...",
  children
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

        <div className="flex items-end">
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
