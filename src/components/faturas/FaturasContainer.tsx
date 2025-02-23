
import { useState } from "react";
import { useFaturas } from "@/hooks/useFaturas";
import { FaturasHeader } from "./FaturasHeader";
import { FaturasDashboard } from "./FaturasDashboard";
import { FaturasTable } from "./FaturasTable";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { FilterBar } from "@/components/shared/FilterBar";
import { useMonthSelection } from "@/hooks/useMonthSelection";
import { MonthSelector } from "./MonthSelector";
import { FaturaEditModal } from "./FaturaEditModal";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function FaturasContainer() {
  const [status, setStatus] = useState<FaturaStatus | "todos">("todos");
  const [busca, setBusca] = useState("");
  const [editingFatura, setEditingFatura] = useState<Fatura | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { currentDate, handlePreviousMonth, handleNextMonth } = useMonthSelection();

  const { 
    faturas, 
    isLoading, 
    gerarFaturas, 
    isGenerating,
    updateFatura,
    updateFaturaStatus,
    deleteFatura,
  } = useFaturas(currentDate);

  const handleLimparFiltros = () => {
    setStatus("todos");
    setBusca("");
  };

  const handleEditFatura = (fatura: Fatura) => {
    setEditingFatura(fatura);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingFatura(null);
  };

  const handleEditSuccess = (updateData: any) => {
    updateFatura(updateData);
  };

  const filteredFaturas = faturas?.filter(fatura => {
    if (status !== "todos" && fatura.status !== status) return false;
    
    if (busca) {
      const searchTerm = busca.toLowerCase();
      const ucMatch = fatura.unidade_beneficiaria.numero_uc.toLowerCase().includes(searchTerm);
      const cooperadoMatch = fatura.unidade_beneficiaria.cooperado.nome.toLowerCase().includes(searchTerm);
      if (!ucMatch && !cooperadoMatch) return false;
    }
    
    return true;
  });

  return (
    <div className="space-y-6">
      <FaturasHeader
        onGerarFaturas={gerarFaturas}
        isGenerating={isGenerating}
      />

      <MonthSelector 
        currentDate={currentDate}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
      />

      <FaturasDashboard 
        faturas={filteredFaturas}
        isLoading={isLoading}
      />

      <FilterBar
        busca={busca}
        onBuscaChange={setBusca}
        onLimparFiltros={handleLimparFiltros}
        placeholder="Buscar por UC ou nome do cooperado..."
      >
        <div className="w-full sm:w-48">
          <Label htmlFor="status">Status</Label>
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as FaturaStatus | "todos")}
          >
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="gerada">Gerada</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="enviada">Enviada</SelectItem>
                <SelectItem value="corrigida">Corrigida</SelectItem>
                <SelectItem value="reenviada">Reenviada</SelectItem>
                <SelectItem value="atrasada">Atrasada</SelectItem>
                <SelectItem value="paga">Paga</SelectItem>
                <SelectItem value="finalizada">Finalizada</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </FilterBar>

      <FaturasTable
        faturas={filteredFaturas}
        isLoading={isLoading}
        onEditFatura={handleEditFatura}
        onUpdateStatus={updateFaturaStatus}
        onDeleteFatura={async (id) => await deleteFatura(id)}
      />

      {editingFatura && (
        <FaturaEditModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          fatura={editingFatura}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}
