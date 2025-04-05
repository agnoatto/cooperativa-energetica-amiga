
/**
 * Página Principal de Contas e Bancos
 * 
 * Esta página centraliza as informações sobre contas bancárias e caixas da empresa,
 * exibindo saldos, movimentações recentes e oferecendo acesso às funcionalidades
 * de cadastro, conciliação e transferências.
 */
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Landmark, ArrowLeftRight, Plus, CreditCard, RefreshCw, BarChart3, Wallet, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ContasBancosResumo } from "@/components/contas-bancos/ContasBancosResumo";
import { useContasBancarias } from "@/hooks/contas-bancos/useContasBancarias";
import { formatarMoeda } from "@/utils/formatters";
import { useToast } from "@/components/ui/use-toast";

export default function ContasBancos() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Hook para buscar contas bancárias (será implementado depois)
  const { data: contas, isLoading } = useContasBancarias();
  
  // Calcular totais (será implementado quando tivermos os dados reais)
  const totalSaldos = contas?.reduce((acc, curr) => acc + curr.saldo_atual, 0) || 0;

  // Redirecionar para a página de configurações com a aba "contas" selecionada
  useEffect(() => {
    toast({
      title: "Funcionalidade atualizada!",
      description: "O gerenciamento de contas bancárias foi movido para a área de Configurações para simplificar o processo.",
    });
    navigate('/configuracoes?tab=contas');
  }, [navigate, toast]);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="flex items-center gap-2">
          <Landmark className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Contas e Bancos</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate('/configuracoes?tab=contas')}>
            <Settings className="mr-1 h-4 w-4" /> Gerenciar Contas
          </Button>
        </div>
      </div>
      
      {/* Resumo Visual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Saldo Consolidado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {formatarMoeda(totalSaldos)}
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {contas?.length || 0} contas ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Contas Bancárias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-blue-600">
                {contas?.filter(c => c.tipo !== 'caixa').length || 0}
              </div>
              <CreditCard className="h-8 w-8 text-blue-500" />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Para gerenciar, vá até Configurações
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Caixas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-green-600">
                {contas?.filter(c => c.tipo === 'caixa').length || 0}
              </div>
              <Wallet className="h-8 w-8 text-green-500" />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Para gerenciar, vá até Configurações
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo das contas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle>Resumo das Contas</CardTitle>
            <CardDescription>Saldos e situação das contas</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/configuracoes?tab=contas')}>
            <Settings className="mr-1 h-4 w-4" /> Gerenciar
          </Button>
        </CardHeader>
        <CardContent>
          <ContasBancosResumo 
            contas={contas || []} 
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
