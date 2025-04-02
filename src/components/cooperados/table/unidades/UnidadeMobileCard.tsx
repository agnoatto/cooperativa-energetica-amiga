
/**
 * Componente de card para visualização de unidades em dispositivos móveis
 * 
 * Este componente exibe os dados de uma unidade beneficiária em formato de card,
 * otimizado para visualização em dispositivos móveis, incluindo todas as
 * informações relevantes e ações disponíveis.
 */
import { Button } from "@/components/ui/button";
import { Edit, Archive, ArchiveRestore } from "lucide-react";
import { formatarKwh } from "@/utils/formatters";
import { StatusBadge } from "./StatusBadge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UnidadeMobileCardProps {
  unidade: any;
  onViewDetails: (unidade: any) => void;
  onEdit: (cooperadoId: string, unidadeId: string) => void;
  onDelete: (unidadeId: string) => void;
  onReativar?: (unidadeId: string) => void;
  setUnidadeToDesativar: (unidade: any) => void;
}

export function UnidadeMobileCard({
  unidade,
  onViewDetails,
  onEdit,
  onReativar,
  setUnidadeToDesativar
}: UnidadeMobileCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isActive = unidade.data_saida === null;

  return (
    <div 
      key={unidade.id}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
      onClick={() => onViewDetails(unidade)}
      role="button"
      tabIndex={0}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-gray-900">UC: {unidade.numero_uc}</h3>
          {unidade.apelido && (
            <p className="text-sm text-gray-500 mt-1">
              Apelido: {unidade.apelido}
            </p>
          )}
        </div>
        <div><StatusBadge isActive={isActive} /></div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="grid grid-cols-2 gap-1">
          <span className="text-gray-500">Desconto:</span>
          <span>{unidade.percentual_desconto}%</span>
        </div>

        <div className="grid grid-cols-2 gap-1">
          <span className="text-gray-500">Consumo:</span>
          <span>{formatarKwh(unidade.consumo_kwh)} kWh</span>
        </div>

        <div className="grid grid-cols-2 gap-1">
          <span className="text-gray-500">Data Entrada:</span>
          <span>{formatDate(unidade.data_entrada)}</span>
        </div>

        {unidade.data_saida && (
          <div className="grid grid-cols-2 gap-1">
            <span className="text-gray-500">Data Saída:</span>
            <span>{formatDate(unidade.data_saida)}</span>
          </div>
        )}

        <div className="mt-2 pt-2 border-t border-gray-100">
          <p className="text-gray-600 text-sm line-clamp-2">{unidade.endereco}</p>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        {isActive ? (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(unidade.cooperado_id, unidade.id);
                    }}
                    className="h-10 w-10 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Editar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUnidadeToDesativar(unidade);
                    }}
                    className="h-10 w-10 p-0"
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Desativar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReativar && onReativar(unidade.id);
                  }}
                  className="h-10 w-10 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                >
                  <ArchiveRestore className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reativar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}
