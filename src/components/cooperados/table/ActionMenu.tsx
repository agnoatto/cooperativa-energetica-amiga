
/**
 * Componente ActionMenu - Menu de ações para tabela de cooperados
 * 
 * Este componente exibe um menu dropdown com ações disponíveis para cada cooperado
 * na tabela, como visualizar, editar, adicionar unidade e excluir.
 * 
 * Foi redesenhado para evitar problemas de travamento ao renderizar os subcomponentes,
 * integrando o Dialog diretamente no componente e usando DialogTrigger para abrir
 * o modal de detalhes sem conflito com o dropdown.
 */
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ActionMenuProps } from "./types";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { PersonalInfoSection } from "../PersonalInfoSection";
import { ResponsiblePersonSection } from "../ResponsiblePersonSection";
import { UnitsTabContent } from "../UnitsTabContent";
import { InvoicesTabContent } from "../InvoicesTabContent";

export function ActionMenu({ cooperado, onEdit, onDelete, onAddUnidade, onViewDetails }: ActionMenuProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Função para interromper a propagação de eventos
  const handleAction = (
    e: React.MouseEvent, 
    callback: (id: string) => void, 
    id: string
  ) => {
    e.stopPropagation();
    e.preventDefault();
    callback(id);
  };

  // Buscar dados do cooperado para o diálogo de detalhes
  const { data: cooperadoDetalhes, isLoading: isLoadingCooperado } = useQuery({
    queryKey: ["cooperado", cooperado.id, dialogOpen],
    queryFn: async () => {
      if (!dialogOpen) return null;
      const { data, error } = await supabase
        .from("cooperados")
        .select("*")
        .eq("id", cooperado.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: dialogOpen,
  });

  // Buscar unidades do cooperado para o diálogo de detalhes
  const { data: unidades, isLoading: isLoadingUnidades } = useQuery({
    queryKey: ["unidades", cooperado.id, dialogOpen],
    queryFn: async () => {
      if (!dialogOpen) return null;
      const { data, error } = await supabase
        .from("unidades_beneficiarias")
        .select(`
          id,
          numero_uc,
          apelido,
          endereco,
          percentual_desconto,
          data_entrada,
          data_saida,
          faturas (
            id,
            consumo_kwh,
            valor_assinatura,
            data_vencimento,
            status,
            valor_desconto
          )
        `)
        .eq("cooperado_id", cooperado.id);

      if (error) throw error;
      return data;
    },
    enabled: dialogOpen,
  });

  return (
    <TooltipProvider>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
              onClick={() => setDialogOpen(true)}
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

        {/* Conteúdo do Dialog incorporado diretamente no ActionMenu */}
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Cooperado</DialogTitle>
          </DialogHeader>

          {isLoadingCooperado ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          ) : cooperadoDetalhes && (
            <div className="space-y-6">
              <PersonalInfoSection
                nome={cooperadoDetalhes.nome}
                documento={cooperadoDetalhes.documento}
                tipo_pessoa={cooperadoDetalhes.tipo_pessoa}
                telefone={cooperadoDetalhes.telefone}
                email={cooperadoDetalhes.email}
              />

              {cooperadoDetalhes.tipo_pessoa === 'PJ' && (
                <ResponsiblePersonSection
                  nome={cooperadoDetalhes.responsavel_nome}
                  cpf={cooperadoDetalhes.responsavel_cpf}
                  telefone={cooperadoDetalhes.responsavel_telefone}
                />
              )}

              <Tabs defaultValue="unidades" className="w-full">
                <TabsList>
                  <TabsTrigger value="unidades">Unidades Beneficiárias</TabsTrigger>
                  <TabsTrigger value="faturas">Histórico de Faturas</TabsTrigger>
                </TabsList>

                <TabsContent value="unidades" className="mt-4">
                  <UnitsTabContent
                    units={unidades}
                    isLoading={isLoadingUnidades}
                  />
                </TabsContent>

                <TabsContent value="faturas" className="mt-4">
                  <InvoicesTabContent
                    units={unidades}
                    isLoading={isLoadingUnidades}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
