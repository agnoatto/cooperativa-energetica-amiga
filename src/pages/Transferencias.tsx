
/**
 * Página de Transferências Bancárias
 * 
 * Esta página lista todas as transferências entre contas, incluindo
 * depósitos, saques e transferências internas, com filtros e ações
 * para gerenciamento das operações.
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeftRight, 
  Plus, 
  Search, 
  Filter,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { useTransferencias } from "@/hooks/contas-bancos/useTransferencias";
import { TransferenciasTable } from "@/components/contas-bancos/TransferenciasTable";
import { TransferenciasCards } from "@/components/contas-bancos/TransferenciasCards";
import { useIsMobile } from "@/hooks/use-mobile";
import { TipoTransferencia, StatusTransferencia } from "@/types/contas-bancos";

export default function Transferencias() {
  const [busca, setBusca] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState<TipoTransferencia | "todos">("todos");
  const [statusFiltro, setStatusFiltro] = useState<StatusTransferencia | "todos">("todos");
  const [dataInicio, setDataInicio] = useState<Date | undefined>(undefined);
  const [dataFim, setDataFim] = useState<Date | undefined>(undefined);
  const [showFiltros, setShowFiltros] = useState(false);
  
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Hook para buscar transferências (será implementado depois)
  const { data: transferencias, isLoading, refetch } = useTransferencias({
    busca,
    tipo: tipoFiltro !== "todos" ? tipoFiltro : undefined,
    status: statusFiltro !== "todos" ? statusFiltro : undefined,
    dataInicio: dataInicio?.toISOString(),
    dataFim: dataFim?.toISOString(),
  });
  
  const handleLimparFiltros = () => {
    setBusca("");
    setTipoFiltro("todos");
    setStatusFiltro("todos");
    setDataInicio(undefined);
    setDataFim(undefined);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Transferências</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate('/financeiro/contas-bancos/transferencias/cadastrar')}>
            <Plus className="mr-1 h-4 w-4" /> Nova Transferência
          </Button>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="mr-1 h-4 w-4" /> Atualizar
          </Button>
        </div>
      </div>
      
      {/* Filtros básicos */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar por descrição ou conta..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Button 
          variant={showFiltros ? "default" : "outline"} 
          onClick={() => setShowFiltros(!showFiltros)}
        >
          <Filter className="mr-1 h-4 w-4" /> 
          Filtros
        </Button>
        
        <Button variant="ghost" onClick={handleLimparFiltros}>
          Limpar Filtros
        </Button>
      </div>
      
      {/* Filtros avançados */}
      {showFiltros && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="text-sm font-medium mb-1 block">Tipo</label>
            <Select 
              value={tipoFiltro} 
              onValueChange={(value) => setTipoFiltro(value as TipoTransferencia | "todos")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo de Transferência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="interna">Transferência Interna</SelectItem>
                <SelectItem value="externa">Transferência Externa</SelectItem>
                <SelectItem value="entrada">Entrada/Depósito</SelectItem>
                <SelectItem value="saida">Saída/Saque</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Status</label>
            <Select 
              value={statusFiltro} 
              onValueChange={(value) => setStatusFiltro(value as StatusTransferencia | "todos")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="concluida">Concluída</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
                <SelectItem value="falha">Falha</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Data Inicial</label>
            <DatePicker
              value={dataInicio}
              onChange={setDataInicio}
              placeholder="Data inicial"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Data Final</label>
            <DatePicker
              value={dataFim}
              onChange={setDataFim}
              placeholder="Data final"
            />
          </div>
        </div>
      )}
      
      {/* Conteúdo principal - adaptado para mobile ou desktop */}
      {isMobile ? (
        <TransferenciasCards 
          transferencias={transferencias || []}
          isLoading={isLoading}
        />
      ) : (
        <TransferenciasTable 
          transferencias={transferencias || []}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
