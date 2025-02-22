
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { format } from "date-fns";
import { UnidadeMobileCardProps } from "./types";

export function UnidadeMobileCard({ 
  unidade, 
  onEdit, 
  onDelete 
}: UnidadeMobileCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-gray-900">UC: {unidade.numero_uc}</h3>
          {unidade.apelido && (
            <p className="text-sm text-gray-500 mt-1">
              Apelido: {unidade.apelido}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="grid grid-cols-2 gap-1">
          <span className="text-gray-500">Desconto:</span>
          <span>{unidade.percentual_desconto}%</span>
        </div>

        <div className="grid grid-cols-2 gap-1">
          <span className="text-gray-500">Data Entrada:</span>
          <span>{format(new Date(unidade.data_entrada), 'dd/MM/yyyy')}</span>
        </div>

        {unidade.data_saida && (
          <div className="grid grid-cols-2 gap-1">
            <span className="text-gray-500">Data Saída:</span>
            <span>{format(new Date(unidade.data_saida), 'dd/MM/yyyy')}</span>
          </div>
        )}

        <div className="mt-2 pt-2 border-t border-gray-100">
          <p className="text-gray-600 text-sm line-clamp-2">{unidade.endereco}</p>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onEdit(unidade.cooperado_id, unidade.id)}
          className="h-10 w-10 p-0"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onDelete(unidade.id)}
          className="h-10 w-10 p-0"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
