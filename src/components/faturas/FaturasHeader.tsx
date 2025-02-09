
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

interface FaturasHeaderProps {
  onGerarFaturas: () => void;
  isGenerating: boolean;
}

export function FaturasHeader({ onGerarFaturas, isGenerating }: FaturasHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1">
        <h1 className="text-2xl font-semibold text-gray-900">Faturas</h1>
      </div>
      
      <div className="flex flex-1 items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar faturas..."
            className="pl-9 h-9"
          />
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtrar
        </Button>
        
        <Button
          size="sm"
          onClick={onGerarFaturas}
          disabled={isGenerating}
        >
          {isGenerating ? "Gerando..." : "Gerar Faturas"}
        </Button>
      </div>
    </div>
  );
}
