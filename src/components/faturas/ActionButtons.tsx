
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onGerarFaturas: () => void;
  isGenerating: boolean;
}

export function ActionButtons({ onGerarFaturas, isGenerating }: ActionButtonsProps) {
  return (
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
  );
}
