
/**
 * Hook para gerenciar a página de cooperados
 * 
 * Este hook centraliza a lógica da página de cooperados, incluindo
 * o gerenciamento de estado, operações de CRUD e funcionalidades relacionadas.
 */
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCooperadosQuery } from "./useCooperadosQuery";

type OrderBy = "nome_asc" | "nome_desc" | "cadastro_asc" | "cadastro_desc" | "tipo_asc" | "tipo_desc";
type StatusFilter = "ativos" | "inativos" | "todos";

export function useCooperadosPage() {
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

  const handleAddUnidade = (cooperadoId: string) => {
    window.location.href = `/cooperados/unidades?cooperado=${cooperadoId}`;
  };

  const handleLimparFiltros = () => {
    setBusca("");
    setOrderBy("nome_asc");
    setStatusFilter("ativos");
  };

  const handleAddNewCooperado = () => {
    setSelectedCooperadoId(null);
    setShowCooperadoForm(true);
  };

  return {
    // Estados
    busca,
    orderBy,
    statusFilter,
    selectedCooperadoId,
    showCooperadoForm,
    showDetailsDialog,
    cooperados,
    unidades,
    isLoading,
    
    // Setters
    setBusca,
    setOrderBy,
    setStatusFilter,
    setShowDetailsDialog,

    // Handlers
    handleEdit,
    handleDelete,
    handleReactivate,
    handleViewDetails,
    handleAddUnidade,
    handleLimparFiltros,
    handleAddNewCooperado,
    
    // Form
    setShowCooperadoForm,
    fetchData
  };
}
