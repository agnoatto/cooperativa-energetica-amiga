
/**
 * Página de gerenciamento de cooperados
 * 
 * Esta página permite visualizar, cadastrar, editar e gerenciar cooperados
 * e suas unidades beneficiárias. A funcionalidade foi dividida em componentes
 * menores para melhor manutenção e organização do código.
 */
import { CooperadoForm } from "@/components/cooperados/CooperadoForm";
import { CooperadosTable } from "@/components/cooperados/CooperadosTable";
import { CooperadosHeader } from "@/components/cooperados/CooperadosHeader";
import { CooperadoDetailsDialog } from "@/components/cooperados/CooperadoDetailsDialog";
import { CooperadosFilterBar } from "@/components/cooperados/CooperadosFilterBar";
import { useCooperadosPage } from "@/components/cooperados/hooks/useCooperadosPage";

const Cooperados = () => {
  const {
    busca,
    orderBy,
    statusFilter,
    selectedCooperadoId,
    showCooperadoForm,
    showDetailsDialog,
    cooperados,
    unidades,
    isLoading,
    
    setBusca,
    setOrderBy,
    setStatusFilter,
    setShowDetailsDialog,
    
    handleEdit,
    handleDelete,
    handleReactivate,
    handleViewDetails,
    handleAddUnidade,
    handleLimparFiltros,
    handleAddNewCooperado,
    
    setShowCooperadoForm,
    fetchData
  } = useCooperadosPage();

  return (
    <div className="space-y-6">
      <CooperadosHeader onNewCooperado={handleAddNewCooperado} />

      <CooperadosFilterBar
        busca={busca}
        onBuscaChange={setBusca}
        orderBy={orderBy}
        onOrderByChange={setOrderBy}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onLimparFiltros={handleLimparFiltros}
      />

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
        onAddUnidade={handleAddUnidade}
        onViewDetails={handleViewDetails}
        statusFilter={statusFilter}
      />

      <CooperadoDetailsDialog
        cooperadoId={selectedCooperadoId}
        isOpen={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
        onEdit={handleEdit}
        onAddUnidade={handleAddUnidade}
      />
    </div>
  );
};

export default Cooperados;
