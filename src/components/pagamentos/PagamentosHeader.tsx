
import { Button } from "@/components/ui/button";

interface PagamentosHeaderProps {
  onGerarPagamentos: () => void;
  isGenerating: boolean;
}

export function PagamentosHeader({ onGerarPagamentos, isGenerating }: PagamentosHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-gray-900">Pagamentos</h1>
      <div className="space-x-2">
        <Button variant="outline">Filtrar</Button>
        <Button 
          className="bg-primary hover:bg-primary/90"
          onClick={onGerarPagamentos}
          disabled={isGenerating}
        >
          {isGenerating ? "Gerando..." : "Gerar Pagamentos"}
        </Button>
      </div>
    </div>
  );
}
