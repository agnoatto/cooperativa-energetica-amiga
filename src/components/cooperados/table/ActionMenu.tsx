
/**
 * Componente ActionMenu - Menu de ações para tabela de cooperados
 * 
 * Este componente exibe um menu dropdown com ações disponíveis para cada cooperado
 * na tabela, como visualizar, editar, adicionar unidade e excluir.
 * 
 * Foi redesenhado para evitar problemas de travamento ao renderizar os subcomponentes.
 */
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ActionMenuProps } from "./types";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export function ActionMenu({ cooperado, onEdit, onDelete, onAddUnidade, onViewDetails }: ActionMenuProps) {
  // Função para interromper a propagação de eventos para evitar que cliques
  // no menu afetem elementos pai
  const handleAction = (
    e: React.MouseEvent, 
    callback: (id: string) => void, 
    id: string
  ) => {
    e.stopPropagation();
    e.preventDefault();
    callback(id);
  };

  return (
    <TooltipProvider>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                </svg>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ações</p>
          </TooltipContent>
        </Tooltip>
        
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem 
            onClick={(e) => handleAction(e, onViewDetails, cooperado.id)}
            className="cursor-pointer"
          >
            <Eye className="mr-2 h-4 w-4" />
            <span>Visualizar</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={(e) => handleAction(e, onEdit, cooperado.id)}
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4" />
            <span>Editar</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={(e) => handleAction(e, onAddUnidade, cooperado.id)}
            className="cursor-pointer"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span>Adicionar Unidade</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={(e) => handleAction(e, onDelete, cooperado.id)}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <Trash className="mr-2 h-4 w-4" />
            <span>Excluir</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}
