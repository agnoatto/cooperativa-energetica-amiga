/**
 * Página de Contas Bancárias
 * 
 * Esta página lista todas as contas bancárias e caixas cadastradas,
 * permitindo visualizar saldos, editar informações e realizar operações.
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Landmark, 
  Plus, 
  Search, 
  CreditCard, 
  Wallet,
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
import { useContasBancarias } from "@/hooks/contas-bancos/useContasBancarias";
import { ContasBancariasTable } from "@/components/contas-bancos/ContasBancariasTable";
import { ContasBancariasCards } from "@/components/contas-bancos/ContasBancariasCards";
import { useIsMobile } from "@/hooks/use-mobile";
import { TipoContaBancaria } from "@/types/contas-bancos";

export default function ContasBancarias() {
  const [busca, setBusca] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState<TipoContaBancaria | "todos">("todos");
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const { data: contas, isLoading, refetch } = useContasBancarias({
    busca,
    tipo: tipoFiltro !== "todos" ? tipoFiltro : undefined
  });
  
  const handleLimparFiltros = () => {
    setBusca("");
    setTipoFiltro("todos");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="flex items-center gap-2">
          <CreditCard className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Contas Bancárias</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate('/financeiro/contas-bancos/contas/cadastrar')}>
            <Plus className="mr-1 h-4 w-4" /> Nova Conta
          </Button>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="mr-1 h-4 w-4" /> Atualizar
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar por nome, banco ou agência..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Select 
          value={tipoFiltro} 
          onValueChange={(value) => setTipoFiltro(value as TipoContaBancaria | "todos")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo de Conta" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os tipos</SelectItem>
            <SelectItem value="corrente">Conta Corrente</SelectItem>
            <SelectItem value="poupanca">Conta Poupança</SelectItem>
            <SelectItem value="investimento">Investimento</SelectItem>
            <SelectItem value="caixa">Caixa</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="ghost" onClick={handleLimparFiltros}>
          Limpar Filtros
        </Button>
      </div>
      
      {isMobile ? (
        <ContasBancariasCards 
          contas={contas || []}
          isLoading={isLoading}
        />
      ) : (
        <ContasBancariasTable 
          contas={contas || []}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
