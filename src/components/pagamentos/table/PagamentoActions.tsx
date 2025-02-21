
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Edit, FileText, Loader2, MoreHorizontal, FileBarChart2, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PagamentoData } from "../types/pagamento";
import { cn } from "@/lib/utils";

interface PagamentoActionsProps {
  pagamento: PagamentoData;
  onViewDetails: (pagamento: PagamentoData) => void;
  onEdit: (pagamento: PagamentoData) => void;
  onDelete: (pagamento: PagamentoData) => void;
  onViewFile: () => void;
  isLoadingFile: boolean;
}

export function PagamentoActions({
  pagamento,
  onViewDetails,
  onEdit,
  onDelete,
  onViewFile,
  isLoadingFile
}: PagamentoActionsProps) {
  const hasFile = !!pagamento.arquivo_conta_energia_path;

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        {/* Visualizar Detalhes */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex items-center text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => onViewDetails(pagamento)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Detalhes
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Visualizar detalhes do pagamento</p>
          </TooltipContent>
        </Tooltip>

        {/* Editar */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex items-center"
              onClick={() => onEdit(pagamento)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Editar pagamento</p>
          </TooltipContent>
        </Tooltip>

        {/* Visualizar Conta de Energia */}
        {hasFile && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onViewFile}
                disabled={isLoadingFile}
                className={cn(
                  "text-blue-500 hover:text-blue-600",
                  isLoadingFile && "cursor-not-allowed"
                )}
              >
                {isLoadingFile ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Visualizar conta de energia</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Menu Dropdown para Mais Ações */}
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="ml-2">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Mais ações</p>
            </TooltipContent>
          </Tooltip>
          
          <DropdownMenuContent align="end" className="w-[180px]">
            <DropdownMenuItem onClick={() => onViewDetails(pagamento)} className="sm:hidden">
              <Eye className="mr-2 h-4 w-4" />
              <span>Visualizar Detalhes</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => onEdit(pagamento)} className="sm:hidden">
              <Edit className="mr-2 h-4 w-4" />
              <span>Editar</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="sm:hidden" />
            
            <DropdownMenuItem>
              <FileBarChart2 className="mr-2 h-4 w-4" />
              <span>Boletim de Medição</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            
            <DropdownMenuItem
              onClick={() => onDelete(pagamento)}
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Excluir</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TooltipProvider>
    </div>
  );
}
