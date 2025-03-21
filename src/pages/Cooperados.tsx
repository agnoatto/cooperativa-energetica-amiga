
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CooperadoForm } from "@/components/cooperados/CooperadoForm";
import { CooperadosTable } from "@/components/cooperados/CooperadosTable";
import { FilterBar } from "@/components/shared/FilterBar";
import { CooperadosHeader } from "@/components/cooperados/CooperadosHeader";
import { useCooperadosQuery } from "@/components/cooperados/hooks/useCooperadosQuery";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoSection } from "@/components/cooperados/PersonalInfoSection";
import { ResponsiblePersonSection } from "@/components/cooperados/ResponsiblePersonSection";
import { UnitsTabContent } from "@/components/cooperados/UnitsTabContent";
import { InvoicesTabContent } from "@/components/cooperados/InvoicesTabContent";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

type OrderBy = "nome_asc" | "nome_desc" | "cadastro_asc" | "cadastro_desc" | "tipo_asc" | "tipo_desc";
type StatusFilter = "ativos" | "inativos" | "todos";

const Cooperados = () => {
  const [showCooperadoForm, setShowCooperadoForm] = useState(false);
  const [selectedCooperadoId, setSelectedCooperadoId] = useState<string | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [busca, setBusca] = useState("");
  const [orderBy, setOrderBy] = useState<OrderBy>("nome_asc");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ativos");
  
  const { cooperados, unidades, isLoading, fetchData } = useCooperadosQuery();

  useEffect(() => {
    fetchData(busca, orderBy, statusFilter);
  }, [busca, orderBy, statusFilter, fetchData]);

  const handleEdit = (cooperadoId: string) => {
    setSelectedCooperadoId(cooperadoId);
    setShowCooperadoForm(true);
  };

  const handleDelete = async (cooperadoId: string) => {
    try {
      const currentDate = new Date().toISOString();

      const { error: cooperadoError } = await supabase
        .from('cooperados')
        .update({ data_exclusao: currentDate })
        .eq('id', cooperadoId);

      if (cooperadoError) throw cooperadoError;

      const { error: unidadesError } = await supabase
        .from('unidades_beneficiarias')
        .update({ data_saida: currentDate })
        .eq('cooperado_id', cooperadoId)
        .is('data_saida', null);

      if (unidadesError) throw unidadesError;

      toast.success("Cooperado e suas unidades beneficiárias foram excluídos com sucesso!");
      fetchData(busca, orderBy, statusFilter);
    } catch (error: any) {
      toast.error("Erro ao excluir cooperado: " + error.message);
    }
  };

  const handleReactivate = async (cooperadoId: string) => {
    try {
      // Reativa o cooperado definindo data_exclusao como null
      const { error: cooperadoError } = await supabase
        .from('cooperados')
        .update({ data_exclusao: null })
        .eq('id', cooperadoId);

      if (cooperadoError) throw cooperadoError;

      toast.success("Cooperado reativado com sucesso!");
      fetchData(busca, orderBy, statusFilter);
    } catch (error: any) {
      toast.error("Erro ao reativar cooperado: " + error.message);
    }
  };

  const handleViewDetails = (cooperadoId: string) => {
    setSelectedCooperadoId(cooperadoId);
    setShowDetailsDialog(true);
  };

  const handleLimparFiltros = () => {
    setBusca("");
    setOrderBy("nome_asc");
    setStatusFilter("ativos");
  };

  // Buscar dados do cooperado para o diálogo de detalhes
  const { data: cooperadoDetalhes, isLoading: isLoadingCooperado } = useQuery({
    queryKey: ["cooperado", selectedCooperadoId, showDetailsDialog],
    queryFn: async () => {
      if (!showDetailsDialog || !selectedCooperadoId) return null;
      const { data, error } = await supabase
        .from("cooperados")
        .select("*")
        .eq("id", selectedCooperadoId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: showDetailsDialog && !!selectedCooperadoId,
  });

  // Buscar unidades do cooperado para o diálogo de detalhes
  const { data: unidadesCooperado, isLoading: isLoadingUnidades } = useQuery({
    queryKey: ["unidades", selectedCooperadoId, showDetailsDialog],
    queryFn: async () => {
      if (!showDetailsDialog || !selectedCooperadoId) return null;
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
        .eq("cooperado_id", selectedCooperadoId);

      if (error) throw error;
      return data;
    },
    enabled: showDetailsDialog && !!selectedCooperadoId,
  });

  return (
    <div className="space-y-6">
      <CooperadosHeader 
        onNewCooperado={() => {
          setSelectedCooperadoId(null);
          setShowCooperadoForm(true);
        }}
      />

      <FilterBar
        busca={busca}
        onBuscaChange={setBusca}
        onLimparFiltros={handleLimparFiltros}
        placeholder="Buscar por nome, documento ou nº cadastro..."
      >
        <div className="min-w-[180px]">
          <Label htmlFor="statusFilter">Status</Label>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
            <SelectTrigger id="statusFilter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ativos">Ativos</SelectItem>
              <SelectItem value="inativos">Inativos</SelectItem>
              <SelectItem value="todos">Todos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="min-w-[200px]">
          <Label htmlFor="orderBy">Ordenar por</Label>
          <Select value={orderBy} onValueChange={(value) => setOrderBy(value as OrderBy)}>
            <SelectTrigger id="orderBy">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nome_asc">Nome (A-Z)</SelectItem>
              <SelectItem value="nome_desc">Nome (Z-A)</SelectItem>
              <SelectItem value="cadastro_asc">Nº Cadastro (Crescente)</SelectItem>
              <SelectItem value="cadastro_desc">Nº Cadastro (Decrescente)</SelectItem>
              <SelectItem value="tipo_asc">Tipo (A-Z)</SelectItem>
              <SelectItem value="tipo_desc">Tipo (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FilterBar>

      <CooperadoForm 
        open={showCooperadoForm} 
        onOpenChange={setShowCooperadoForm}
        cooperadoId={selectedCooperadoId || undefined}
        onSuccess={() => fetchData(busca, orderBy, statusFilter)}
      />

      <CooperadosTable
        cooperados={cooperados}
        unidades={unidades}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onReactivate={handleReactivate}
        onAddUnidade={(cooperadoId) => {
          window.location.href = `/cooperados/unidades?cooperado=${cooperadoId}`;
        }}
        onViewDetails={handleViewDetails}
        statusFilter={statusFilter}
      />

      {/* Diálogo de detalhes do cooperado */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
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
                    units={unidadesCooperado}
                    isLoading={isLoadingUnidades}
                  />
                </TabsContent>

                <TabsContent value="faturas" className="mt-4">
                  <InvoicesTabContent
                    units={unidadesCooperado}
                    isLoading={isLoadingUnidades}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cooperados;
