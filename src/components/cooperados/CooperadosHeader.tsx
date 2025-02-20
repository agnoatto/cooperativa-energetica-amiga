
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CooperadosHeaderProps {
  onNewCooperado: () => void;
}

export function CooperadosHeader({ onNewCooperado }: CooperadosHeaderProps) {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-gray-900">Cooperados</h1>
      <div className="space-x-2">
        <Button 
          variant="outline"
          onClick={() => navigate('/cooperados/unidades')}
        >
          Ver Unidades Beneficiárias
        </Button>
        <Button onClick={onNewCooperado}>
          <Plus className="mr-2 h-4 w-4" /> Novo Cooperado
        </Button>
      </div>
    </div>
  );
}
