
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { UsinaForm } from "@/components/usinas/UsinaForm";
import { supabase } from "@/integrations/supabase/client";
import { UsinasHeader } from "./usinas/components/UsinasHeader";
import { UsinaMobileCard } from "./usinas/components/UsinaMobileCard";
import { UsinasDesktopTable } from "./usinas/components/UsinasDesktopTable";
import { useUsinas } from "./usinas/hooks/useUsinas";
import { UsinaFilterBar } from "./usinas/components/UsinaFilterBar";
import { UsinasDashboard } from "./usinas/components/UsinasDashboard";

const Usinas = () => {
  const [openForm, setOpenForm] = useState(false);
  const [selectedUsinaId, setSelectedUsinaId] = useState<string | undefined>();
  const [busca, setBusca] = useState("");
  const [colunasVisiveis, setColunasVisiveis] = useState([
    'investidor',
    'unidade',
    'valor_kwh',
    'status',
    'potencia',
    'data_inicio'
  ]);
  
  const isMobile = useIsMobile();
  const { data: usinas, refetch } = useUsinas();

  const handleDelete = async (usinaId: string) => {
    try {
      const { error } = await supabase
        .from('usinas')
        .delete()
        .eq('id', usinaId);

      if (error) throw error;
      refetch();
    } catch (error: any) {
      console.error('Error deleting usina:', error);
    }
  };

  const handleEdit = (usinaId: string) => {
    setSelectedUsinaId(usinaId);
    setOpenForm(true);
  };

  const handleSuccess = () => {
    refetch();
  };

  const handleAddClick = () => {
    setSelectedUsinaId(undefined);
    setOpenForm(true);
  };

  const handleToggleColuna = (colunaId: string) => {
    setColunasVisiveis(prev => 
      prev.includes(colunaId)
        ? prev.filter(id => id !== colunaId)
        : [...prev, colunaId]
    );
  };

  const colunas = [
    { id: 'investidor', label: 'Investidor', visible: colunasVisiveis.includes('investidor') },
    { id: 'unidade', label: 'Unidade', visible: colunasVisiveis.includes('unidade') },
    { id: 'valor_kwh', label: 'Valor do kWh', visible: colunasVisiveis.includes('valor_kwh') },
    { id: 'status', label: 'Status', visible: colunasVisiveis.includes('status') },
    { id: 'potencia', label: 'Potência Instalada', visible: colunasVisiveis.includes('potencia') },
    { id: 'data_inicio', label: 'Data de Início', visible: colunasVisiveis.includes('data_inicio') },
  ];

  const usinasFiltradas = usinas?.filter(usina => {
    const termoBusca = busca.toLowerCase();
    return (
      usina.investidor?.nome_investidor?.toLowerCase().includes(termoBusca) ||
      usina.unidade?.numero_uc?.toLowerCase().includes(termoBusca)
    );
  });

  if (isMobile) {
    return (
      <div className="space-y-6 p-4">
        <UsinasHeader onAddClick={handleAddClick} />
        
        <UsinasDashboard />

        <UsinaFilterBar
          busca={busca}
          onBuscaChange={setBusca}
          onLimparFiltros={() => setBusca("")}
          colunas={colunas}
          onToggleColuna={handleToggleColuna}
        />

        <div className="space-y-4">
          {usinasFiltradas?.map((usina) => (
            <UsinaMobileCard
              key={usina.id}
              usina={usina}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}

          {(!usinasFiltradas || usinasFiltradas.length === 0) && (
            <div className="text-center py-8 px-4 border rounded-lg">
              <p className="text-gray-500">Nenhuma usina encontrada</p>
            </div>
          )}
        </div>

        <UsinaForm
          open={openForm}
          onOpenChange={setOpenForm}
          usinaId={selectedUsinaId}
          onSuccess={handleSuccess}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UsinasHeader onAddClick={handleAddClick} />
      
      <UsinasDashboard />
      
      <UsinaFilterBar
        busca={busca}
        onBuscaChange={setBusca}
        onLimparFiltros={() => setBusca("")}
        colunas={colunas}
        onToggleColuna={handleToggleColuna}
      />
      
      <UsinasDesktopTable 
        usinas={usinasFiltradas}
        onEdit={handleEdit}
        onDelete={handleDelete}
        colunasVisiveis={colunasVisiveis}
      />

      <UsinaForm
        open={openForm}
        onOpenChange={setOpenForm}
        usinaId={selectedUsinaId}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

export default Usinas;
