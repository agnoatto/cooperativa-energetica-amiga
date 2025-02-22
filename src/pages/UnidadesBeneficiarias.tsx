
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { UnidadeBeneficiariaForm } from "@/components/cooperados/UnidadeBeneficiariaForm";
import { UnidadesTable } from "@/components/cooperados/UnidadesTable";
import { UnidadesDashboard } from "@/components/cooperados/UnidadesDashboard";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { FilterBar } from "@/components/shared/FilterBar";

const UnidadesBeneficiarias = () => {
  const [showUnidadeForm, setShowUnidadeForm] = useState(false);
  const [selectedCooperadoId, setSelectedCooperadoId] = useState<string | null>(null);
  const [selectedUnidadeId, setSelectedUnidadeId] = useState<string | null>(null);
  const [unidades, setUnidades] = useState<any[]>([]);
  const [busca, setBusca] = useState("");
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const fetchData = async () => {
    try {
      let query = supabase
        .from('unidades_beneficiarias')
        .select(`
          *,
          cooperado:cooperados(nome)
        `)
        .is('data_saida', null);

      if (busca) {
        query = query.or(`numero_uc.ilike.%${busca}%,endereco.ilike.%${busca}%,apelido.ilike.%${busca}%`);
      }

      const { data: unidadesData, error: unidadesError } = await query;

      if (unidadesError) throw unidadesError;
      setUnidades(unidadesData);
    } catch (error: any) {
      toast.error("Erro ao carregar dados: " + error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [busca]);

  const handleLimparFiltros = () => {
    setBusca("");
  };

  const handleDeleteUnidade = async (unidadeId: string) => {
    try {
      const { error } = await supabase
        .from('unidades_beneficiarias')
        .update({ data_saida: new Date().toISOString() })
        .eq('id', unidadeId);

      if (error) throw error;

      toast.success("Unidade beneficiária excluída com sucesso!");
      fetchData();
    } catch (error: any) {
      toast.error("Erro ao excluir unidade beneficiária: " + error.message);
    }
  };

  const handleEditUnidade = (cooperadoId: string, unidadeId: string) => {
    setSelectedCooperadoId(cooperadoId);
    setSelectedUnidadeId(unidadeId);
    setShowUnidadeForm(true);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Unidades Beneficiárias
          </h1>
          <Button 
            variant="link" 
            className="px-0 -ml-3 sm:ml-0 text-sm sm:text-base"
            onClick={() => navigate('/cooperados')}
          >
            ← Voltar para Cooperados
          </Button>
        </div>
        <Button
          onClick={() => {
            setSelectedUnidadeId(null);
            setSelectedCooperadoId(null);
            setShowUnidadeForm(true);
          }}
          className="w-full sm:w-auto"
          size={isMobile ? "lg" : "default"}
        >
          <Plus className="mr-2 h-4 w-4" /> Nova Unidade
        </Button>
      </div>

      <UnidadesDashboard />

      <FilterBar
        busca={busca}
        onBuscaChange={setBusca}
        onLimparFiltros={handleLimparFiltros}
        placeholder="Buscar por UC, endereço ou apelido..."
      />

      <UnidadeBeneficiariaForm
        open={showUnidadeForm}
        onOpenChange={(open) => {
          setShowUnidadeForm(open);
          if (!open) {
            setSelectedUnidadeId(null);
            setSelectedCooperadoId(null);
          }
        }}
        cooperadoId={selectedCooperadoId}
        unidadeId={selectedUnidadeId}
        onSuccess={() => {
          fetchData();
          setShowUnidadeForm(false);
        }}
      />
      
      <UnidadesTable
        unidades={unidades}
        onEdit={handleEditUnidade}
        onDelete={handleDeleteUnidade}
      />
    </div>
  );
};

export default UnidadesBeneficiarias;
