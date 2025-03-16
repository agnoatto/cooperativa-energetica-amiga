
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

type OrderBy = "nome_asc" | "nome_desc" | "cadastro_asc" | "cadastro_desc" | "tipo_asc" | "tipo_desc";

const Cooperados = () => {
  const [showCooperadoForm, setShowCooperadoForm] = useState(false);
  const [selectedCooperadoId, setSelectedCooperadoId] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [orderBy, setOrderBy] = useState<OrderBy>("nome_asc");
  
  const { cooperados, unidades, isLoading, fetchData } = useCooperadosQuery();

  useEffect(() => {
    fetchData(busca, orderBy);
  }, [busca, orderBy, fetchData]);

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
      fetchData(busca, orderBy);
    } catch (error: any) {
      toast.error("Erro ao excluir cooperado: " + error.message);
    }
  };

  const handleViewDetails = (cooperadoId: string) => {
    // Essa função não é mais utilizada para abrir o diálogo,
    // mas mantemos para compatibilidade com outros componentes
    console.log("View details for cooperado:", cooperadoId);
  };

  const handleLimparFiltros = () => {
    setBusca("");
    setOrderBy("nome_asc");
  };

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
        onSuccess={() => fetchData(busca, orderBy)}
      />

      <CooperadosTable
        cooperados={cooperados}
        unidades={unidades}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddUnidade={(cooperadoId) => {
          window.location.href = `/cooperados/unidades?cooperado=${cooperadoId}`;
        }}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
};

export default Cooperados;
