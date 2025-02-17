
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { CooperadoForm } from "@/components/cooperados/CooperadoForm";
import { CooperadosTable } from "@/components/cooperados/CooperadosTable";
import { CooperadoDetailsDialog } from "@/components/cooperados/CooperadoDetailsDialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { FilterBar } from "@/components/shared/FilterBar";
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
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [cooperados, setCooperados] = useState<any[]>([]);
  const [unidades, setUnidades] = useState<any[]>([]);
  const [busca, setBusca] = useState("");
  const [orderBy, setOrderBy] = useState<OrderBy>("nome_asc");
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      let query = supabase
        .from('cooperados')
        .select('*')
        .is('data_exclusao', null);

      // Aplicar filtro de busca se existir
      if (busca) {
        query = query.or(`nome.ilike.%${busca}%,documento.ilike.%${busca}%,numero_cadastro.ilike.%${busca}%`);
      }

      // Aplicar ordenação
      switch (orderBy) {
        case "nome_asc":
          query = query.order('nome', { ascending: true });
          break;
        case "nome_desc":
          query = query.order('nome', { ascending: false });
          break;
        case "cadastro_asc":
          query = query.order('numero_cadastro', { ascending: true });
          break;
        case "cadastro_desc":
          query = query.order('numero_cadastro', { ascending: false });
          break;
        case "tipo_asc":
          query = query.order('tipo_pessoa', { ascending: true });
          break;
        case "tipo_desc":
          query = query.order('tipo_pessoa', { ascending: false });
          break;
      }

      const { data: cooperadosData, error: cooperadosError } = await query;

      if (cooperadosError) throw cooperadosError;
      setCooperados(cooperadosData);

      const { data: unidadesData, error: unidadesError } = await supabase
        .from('unidades_beneficiarias')
        .select('*')
        .is('data_saida', null);

      if (unidadesError) throw unidadesError;
      setUnidades(unidadesData);
    } catch (error: any) {
      toast.error("Erro ao carregar dados: " + error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [busca, orderBy]);

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
      fetchData();
    } catch (error: any) {
      toast.error("Erro ao excluir cooperado: " + error.message);
    }
  };

  const handleViewDetails = (cooperadoId: string) => {
    setSelectedCooperadoId(cooperadoId);
    setShowDetailsDialog(true);
  };

  const handleLimparFiltros = () => {
    setBusca("");
    setOrderBy("nome_asc");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Cooperados</h1>
        <div className="space-x-2">
          <Button 
            variant="outline"
            onClick={() => navigate('/cooperados/unidades')}
          >
            Ver Unidades Beneficiárias
          </Button>
          <Button 
            onClick={() => {
              setSelectedCooperadoId(null);
              setShowCooperadoForm(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Novo Cooperado
          </Button>
        </div>
      </div>

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
        onSuccess={fetchData}
      />

      <CooperadoDetailsDialog
        cooperadoId={selectedCooperadoId}
        isOpen={showDetailsDialog}
        onClose={() => {
          setShowDetailsDialog(false);
          setSelectedCooperadoId(null);
        }}
      />

      <CooperadosTable
        cooperados={cooperados}
        unidades={unidades}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddUnidade={(cooperadoId) => {
          navigate(`/cooperados/unidades`);
        }}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
};

export default Cooperados;
