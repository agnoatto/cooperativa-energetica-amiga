
/**
 * Menu de ações para cooperados ativos
 * 
 * Este componente exibe um menu dropdown com as ações disponíveis para
 * cada cooperado ativo, como visualizar detalhes, editar, adicionar unidade e excluir.
 */
import { Eye, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

interface AcoesPopoverProps {
  onViewDetails: () => void;
  onEdit: () => void;
  onAddUnidade: () => void;
  onDelete: () => void;
}

export function AcoesPopover({
  onViewDetails,
  onEdit,
  onAddUnidade,
  onDelete
}: AcoesPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          className="h-8 w-8 p-0"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-2">
        <div className="space-y-1">
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={onViewDetails}
          >
            <Eye className="mr-2 h-4 w-4" />
            Ver detalhes
          </Button>

          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={onEdit}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>

          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={onAddUnidade}
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar unidade
          </Button>

          <div className="border-t border-gray-200 my-1"></div>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
            onClick={onDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
