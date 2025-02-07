
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { CooperadoForm } from "@/components/cooperados/CooperadoForm";
import { CooperadosTable } from "@/components/cooperados/CooperadosTable";
import { CooperadoDetailsDialog } from "@/components/cooperados/CooperadoDetailsDialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Cooperados = () => {
  const [showCooperadoForm, setShowCooperadoForm] = useState(false);
  const [selectedCooperadoId, setSelectedCooperadoId] = useState<string | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [cooperados, setCooperados] = useState<any[]>([]);
  const [unidades, setUnidades] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const { data: cooperadosData, error: cooperadosError } = await supabase
        .from('cooperados')
        .select('*')
        .is('data_exclusao', null);

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
  }, []);

  const handleEdit = (cooperadoId: string) => {
    setSelectedCooperadoId(cooperadoId);
    setShowCooperadoForm(true);
  };

  const handleDelete = async (cooperadoId: string) => {
    try {
      const currentDate = new Date().toISOString();

      // Update cooperado with data_exclusao
      const { error: cooperadoError } = await supabase
        .from('cooperados')
        .update({ data_exclusao: currentDate })
        .eq('id', cooperadoId);

      if (cooperadoError) throw cooperadoError;

      // Update all unidades_beneficiarias related to this cooperado with data_saida
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
