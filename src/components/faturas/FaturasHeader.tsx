
import { Button } from "@/components/ui/button";

interface FaturasHeaderProps {
  onGerarFaturas: () => void;
  isGenerating: boolean;
}

export function FaturasHeader({ onGerarFaturas, isGenerating }: FaturasHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-gray-900">Faturas</h1>
      <div className="space-x-2">
        <Button variant="outline">Filtrar</Button>
        <Button 
          className="bg-primary hover:bg-primary/90"
          onClick={onGerarFaturas}
          disabled={isGenerating}
        >
          {isGenerating ? "Gerando..." : "Gerar Faturas"}
        </Button>
      </div>
    </div>
  );
}
