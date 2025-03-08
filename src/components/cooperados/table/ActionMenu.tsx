
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, Eye, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ActionMenuProps } from "./types";

export function ActionMenu({ cooperado, onEdit, onDelete, onAddUnidade, onViewDetails }: ActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onViewDetails(cooperado.id)}>
          <Eye className="mr-2 h-4 w-4" />
          Visualizar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(cooperado.id)}>
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAddUnidade(cooperado.id)}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Unidade
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onDelete(cooperado.id)}>
          <Trash className="mr-2 h-4 w-4" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
