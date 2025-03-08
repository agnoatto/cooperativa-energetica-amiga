
import { Button } from "@/components/ui/button";
import { Plus, ArchiveRestore } from "lucide-react";
import { useState, useEffect } from "react";
import { UnidadeBeneficiariaForm } from "@/components/cooperados/UnidadeBeneficiariaForm";
import { UnidadesTable } from "@/components/cooperados/UnidadesTable";
import { UnidadesDashboard } from "@/components/cooperados/UnidadesDashboard";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { FilterBar } from "@/components/shared/FilterBar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const UnidadesBeneficiarias = () => {
  const [showUnidadeForm, setShowUnidadeForm] = useState(false);
  const [selectedCooperadoId, setSelectedCooperadoId] = useState<string | null>(null);
  const [selectedUnidadeId, setSelectedUnidadeId] = useState<string | null>(null);
  const [unidades, setUnidades] = useState<any[]>([]);
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<"ativas" | "arquivadas">("ativas");
  const [unidadeParaReativar, setUnidadeParaReativar] = useState<any>(null);
  const [isReativando, setIsReativando] = useState(false);
  const [contadores, setContadores] = useState({ ativas: 0, arquivadas: 0 });
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const fetchData = async () => {
    try {
      // Consulta principal para buscar unidades com base no filtro
      let query = supabase
        .from('unidades_beneficiarias')
        .select(`
          *,
          cooperado:cooperados(nome)
        `);

      if (statusFiltro === "ativas") {
        query = query.is('data_saida', null);
      } else {
        query = query.not('data_saida', 'is', null);
      }

      if (busca) {
        query = query.or(`numero_uc.ilike.%${busca}%,endereco.ilike.%${busca}%,apelido.ilike.%${busca}%`);
      }

      const { data: unidadesData, error: unidadesError } = await query;

      if (unidadesError) throw unidadesError;
      setUnidades(unidadesData);

      // Buscar contadores para os dois tipos de unidades
      const { count: ativasCount } = await supabase
        .from('unidades_beneficiarias')
        .select('id', { count: 'exact', head: true })
        .is('data_saida', null);

      const { count: arquivadasCount } = await supabase
        .from('unidades_beneficiarias')
        .select('id', { count: 'exact', head: true })
        .not('data_saida', 'is', null);

      setContadores({
        ativas: ativasCount || 0,
        arquivadas: arquivadasCount || 0
      });
    } catch (error: any) {
      toast.error("Erro ao carregar dados: " + error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [busca, statusFiltro]);

  const handleLimparFiltros = () => {
    setBusca("");
  };

  const handleDeleteUnidade = async (unidadeId: string, motivo?: string) => {
    try {
      const dataAtual = new Date().toISOString();
      
      // Atualizar com data de saída em vez de excluir permanentemente
      const { error } = await supabase
        .from('unidades_beneficiarias')
        .update({ 
          data_saida: dataAtual,
          ...(motivo ? { observacao: motivo } : {})
        })
        .eq('id', unidadeId);

      if (error) throw error;

      toast.success("Unidade beneficiária desativada com sucesso!");
      fetchData();
    } catch (error: any) {
      toast.error("Erro ao desativar unidade beneficiária: " + error.message);
    }
  };

  const handleReativarUnidade = async (unidadeId: string) => {
    setIsReativando(true);
    try {
      const { error } = await supabase
        .from('unidades_beneficiarias')
        .update({ data_saida: null })
        .eq('id', unidadeId);

      if (error) throw error;

      toast.success("Unidade beneficiária reativada com sucesso!");
      fetchData();
      setUnidadeParaReativar(null);
    } catch (error: any) {
      toast.error("Erro ao reativar unidade beneficiária: " + error.message);
    } finally {
      setIsReativando(false);
    }
  };

  const handleEditUnidade = (cooperadoId: string, unidadeId: string) => {
    setSelectedCooperadoId(cooperadoId);
    setSelectedUnidadeId(unidadeId);
    setShowUnidadeForm(true);
  };

  const renderUnidadesReativar = () => {
    if (statusFiltro !== "arquivadas") return null;

    const unidadesArquivadas = unidades.filter((u) => u.data_saida);
    if (unidadesArquivadas.length === 0) return null;

    return (
      <div className="mt-4 space-y-4">
        {unidadesArquivadas.map((unidade) => (
          <div key={unidade.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
            <div>
              <div className="font-medium">UC: {unidade.numero_uc}</div>
              <div className="text-sm text-gray-500">
                {unidade.apelido ? `${unidade.apelido} - ` : ""}
                Desativada em: {new Date(unidade.data_saida).toLocaleDateString()}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUnidadeParaReativar(unidade)}
              className="gap-2"
            >
              <ArchiveRestore className="h-4 w-4" /> Reativar
            </Button>
          </div>
        ))}
      </div>
    );
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

      <Tabs 
        defaultValue="ativas" 
        value={statusFiltro}
        onValueChange={(value) => setStatusFiltro(value as "ativas" | "arquivadas")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="ativas">
            Ativas ({contadores.ativas})
          </TabsTrigger>
          <TabsTrigger value="arquivadas">
            Arquivadas ({contadores.arquivadas})
          </TabsTrigger>
        </TabsList>

        <FilterBar
          busca={busca}
          onBuscaChange={setBusca}
          onLimparFiltros={handleLimparFiltros}
          placeholder="Buscar por UC, endereço ou apelido..."
        />

        <TabsContent value="ativas" className="mt-6">
          <UnidadesTable
            unidades={unidades}
            onEdit={handleEditUnidade}
            onDelete={handleDeleteUnidade}
          />
        </TabsContent>

        <TabsContent value="arquivadas" className="mt-6">
          {statusFiltro === "arquivadas" && (
            unidades.length > 0 ? (
              <UnidadesTable
                unidades={unidades}
                onEdit={handleEditUnidade}
                onDelete={async () => {}}
              />
            ) : (
              <div className="text-center p-8 border rounded-lg">
                <p className="text-gray-500">Nenhuma unidade arquivada encontrada</p>
              </div>
            )
          )}
        </TabsContent>
      </Tabs>

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
      
      <AlertDialog
        open={!!unidadeParaReativar}
        onOpenChange={(open) => !open && setUnidadeParaReativar(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reativar Unidade Beneficiária</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a reativar a unidade beneficiária UC {unidadeParaReativar?.numero_uc}.
              Esta ação tornará a unidade ativa novamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isReativando}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => unidadeParaReativar && handleReativarUnidade(unidadeParaReativar.id)}
              disabled={isReativando}
            >
              {isReativando ? "Processando..." : "Reativar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UnidadesBeneficiarias;
