
/**
 * Diálogo de detalhes do cooperado
 * 
 * Este componente exibe informações detalhadas sobre um cooperado,
 * incluindo informações pessoais, responsáveis (para PJ) e unidades beneficiárias.
 * Permite também acessar funcionalidades para editar cooperado e adicionar unidades.
 */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { ResponsiblePersonSection } from "./ResponsiblePersonSection";
import { UnitsTabContent } from "./UnitsTabContent";
import { InvoicesTabContent } from "./InvoicesTabContent";
import { Button } from "@/components/ui/button";
import { Pencil, Plus } from "lucide-react";

interface CooperadoDetailsDialogProps {
  cooperadoId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (cooperadoId: string) => void;
  onAddUnidade: (cooperadoId: string) => void;
}

export function CooperadoDetailsDialog({ 
  cooperadoId, 
  isOpen, 
  onClose,
  onEdit,
  onAddUnidade
}: CooperadoDetailsDialogProps) {
  const { data: cooperado, isLoading: isLoadingCooperado } = useQuery({
    queryKey: ["cooperado", cooperadoId],
    queryFn: async () => {
      if (!cooperadoId) return null;
      const { data, error } = await supabase
        .from("cooperados")
        .select("*")
        .eq("id", cooperadoId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!cooperadoId,
  });

  const { data: unidades, isLoading: isLoadingUnidades } = useQuery({
    queryKey: ["unidades", cooperadoId],
    queryFn: async () => {
      if (!cooperadoId) return null;
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
        .eq("cooperado_id", cooperadoId);

      if (error) throw error;
      return data;
    },
    enabled: !!cooperadoId,
  });

  if (!cooperadoId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Detalhes do Cooperado</DialogTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                onEdit(cooperadoId);
                onClose();
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                onAddUnidade(cooperadoId);
                onClose();
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Unidade
            </Button>
          </div>
        </DialogHeader>

        {isLoadingCooperado ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        ) : cooperado && (
          <div className="space-y-6">
            <PersonalInfoSection
              nome={cooperado.nome}
              documento={cooperado.documento}
              tipo_pessoa={cooperado.tipo_pessoa}
              telefone={cooperado.telefone}
              email={cooperado.email}
            />

            {cooperado.tipo_pessoa === 'PJ' && (
              <ResponsiblePersonSection
                nome={cooperado.responsavel_nome}
                cpf={cooperado.responsavel_cpf}
                telefone={cooperado.responsavel_telefone}
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
  );
}
