
import { useState } from "react";
import { useFaturas } from "@/hooks/useFaturas";
import { FaturasHeader } from "./FaturasHeader";
import { FaturasDashboard } from "./FaturasDashboard";
import { FaturasTable } from "./FaturasTable";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { FilterBar } from "@/components/shared/FilterBar";
import { useMonthSelection } from "@/hooks/useMonthSelection";
import { MonthSelector } from "./MonthSelector";
import { FaturaCobrancaModal } from "./FaturaCobrancaModal";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";

export function FaturasContainer() {
  const [status, setStatus] = useState<FaturaStatus | "todos">("todos");
  const [busca, setBusca] = useState("");
  const [selectedFatura, setSelectedFatura] = useState<Fatura | null>(null);
  const [isCobrancaModalOpen, setIsCobrancaModalOpen] = useState(false);
  const { currentDate, handlePreviousMonth, handleNextMonth } = useMonthSelection();
  const queryClient = useQueryClient();

  const { 
    faturas, 
    isLoading, 
    gerarFaturas, 
    isGenerating,
    updateFaturaStatus,
    deleteFatura,
  } = useFaturas(currentDate);

  const handleLimparFiltros = () => {
    setStatus("todos");
    setBusca("");
  };

  const handleCriarCobranca = (fatura: Fatura) => {
    setSelectedFatura(fatura);
    setIsCobrancaModalOpen(true);
  };

  const handleCobrancaSuccess = () => {
    const date = new Date();
    queryClient.invalidateQueries({ 
      queryKey: ['faturas', date.getMonth() + 1, date.getFullYear()]
    });
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

      <FaturasDashboard 
        faturas={filteredFaturas}
        isLoading={isLoading}
      />

      <MonthSelector 
        currentDate={currentDate}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
      />

      <FilterBar
        busca={busca}
        onBuscaChange={setBusca}
        onLimparFiltros={handleLimparFiltros}
        placeholder="Buscar por UC ou nome do cooperado..."
        showColumnsButton
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
        onViewDetails={(fatura) => setSelectedFatura(fatura)}
        onDeleteFatura={async (id) => await deleteFatura(id)}
        onUpdateStatus={updateFaturaStatus}
      />

      {selectedFatura && (
        <FaturaCobrancaModal
          isOpen={isCobrancaModalOpen}
          onClose={() => {
            setIsCobrancaModalOpen(false);
            setSelectedFatura(null);
          }}
          faturaId={selectedFatura.id}
          onSuccess={handleCobrancaSuccess}
        />
      )}
    </div>
  );
}
