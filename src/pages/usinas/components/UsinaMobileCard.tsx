
// Este componente foi atualizado para permitir cliques nos cards
// Ao clicar em uma usina, o usuário é redirecionado para a página de detalhes

import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { formatarMoeda } from "@/utils/formatters";
import { UsinaData } from "../types";
import { useNavigate } from "react-router-dom";

interface UsinaMobileCardProps {
  usina: UsinaData;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function UsinaMobileCard({ usina, onEdit, onDelete }: UsinaMobileCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/usinas/${usina.id}`);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:border-primary/20 hover:shadow-md transition-all"
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-gray-900">
            UC: {usina.unidade?.numero_uc}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {usina.investidor?.nome_investidor}
          </p>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="grid grid-cols-2 gap-1">
          <span className="text-gray-500">Valor do kWh:</span>
          <span>{formatarMoeda(usina.valor_kwh)}</span>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(usina.id);
          }}
          className="h-10 w-10 p-0"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(usina.id);
          }}
          className="h-10 w-10 p-0"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
