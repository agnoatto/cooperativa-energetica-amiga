
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Edit, FileText, Loader2, MoreHorizontal, Trash2, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PagamentoData } from "../types/pagamento";
import { BoletimMedicaoButton } from "../BoletimMedicaoButton";

interface PagamentoActionsProps {
  pagamento: PagamentoData;
  onViewDetails: (pagamento: PagamentoData) => void;
  onEdit: (pagamento: PagamentoData) => void;
  onDelete: (pagamento: PagamentoData) => void;
  onViewFile: () => void;
  onDownloadFile: () => void;
  isLoadingFile: boolean;
}

export function PagamentoActions({
  pagamento,
  onViewDetails,
  onEdit,
  onDelete,
  onViewFile,
  onDownloadFile,
  isLoadingFile
}: PagamentoActionsProps) {
  const hasFile = !!pagamento.arquivo_conta_energia_path;

  return (
    <div className="flex items-center justify-end gap-2">
      <TooltipProvider>
        {/* Visualizar Detalhes - Visível em telas maiores */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="hidden sm:inline-flex h-8 w-8"
              onClick={() => onViewDetails(pagamento)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Visualizar detalhes</p>
          </TooltipContent>
        </Tooltip>

        {/* Editar - Visível em telas maiores */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="hidden sm:inline-flex h-8 w-8"
              onClick={() => onEdit(pagamento)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Editar pagamento</p>
          </TooltipContent>
        </Tooltip>

        {/* Menu Dropdown para Todas as Ações */}
        <DropdownMenu>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mais ações</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <DropdownMenuContent align="end" className="w-[200px]">
            {/* Ações principais no mobile */}
            <DropdownMenuItem onClick={() => onViewDetails(pagamento)} className="sm:hidden">
              <Eye className="mr-2 h-4 w-4" />
              <span>Visualizar Detalhes</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => onEdit(pagamento)} className="sm:hidden">
              <Edit className="mr-2 h-4 w-4" />
              <span>Editar</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="sm:hidden" />
            
            {/* Boletim de Medição */}
            <BoletimMedicaoButton
              pagamento={pagamento}
            />

            {hasFile && (
              <>
                <DropdownMenuItem onClick={onViewFile} disabled={isLoadingFile}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Ver Conta de Energia</span>
                  {isLoadingFile && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={onDownloadFile} disabled={isLoadingFile}>
                  <Download className="mr-2 h-4 w-4" />
                  <span>Baixar Conta de Energia</span>
                  {isLoadingFile && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                </DropdownMenuItem>
              </>
            )}

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
