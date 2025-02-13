
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface FaturasHeaderProps {
  onGerarFaturas: () => void;
  isGenerating: boolean;
}

export function FaturasHeader({ onGerarFaturas, isGenerating }: FaturasHeaderProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 sm:gap-6">
      <h1 className="text-2xl font-bold text-gray-900">Faturas</h1>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Button
          variant="outline"
          className="w-full sm:w-auto justify-center"
          size={isMobile ? "lg" : "default"}
        >
          <Filter className="h-4 w-4 sm:mr-2" />
          {!isMobile && "Filtrar"}
        </Button>
        <Button 
          className="w-full sm:w-auto justify-center"
          onClick={onGerarFaturas}
          disabled={isGenerating}
          size={isMobile ? "lg" : "default"}
        >
          <Plus className="h-4 w-4 sm:mr-2" />
          {isGenerating ? "Gerando..." : "Gerar Faturas"}
        </Button>
      </div>
    </div>
  );
}
