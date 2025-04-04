
/**
 * Dashboard Financeiro
 * 
 * Página principal de visão financeira que centraliza dados críticos financeiros e métricas
 * importantes para tomada de decisão. Inclui visualizações de fluxo de caixa, balanço financeiro,
 * projeções e alertas de posição financeira da gestão de usinas fotovoltaicas.
 */
import { useEffect, useState } from "react";
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  AlertCircle, 
  Calendar, 
  DollarSign,
  FileText, 
  TrendingUp, 
  TrendingDown, 
  Wallet
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useMonthSelection } from "@/hooks/useMonthSelection";
import { MonthSelector } from "@/components/MonthSelector";
import { FinanceiroConsolidado } from "@/components/financeiro/dashboard/FinanceiroConsolidado";
import { FinanceiroReceitaDespesa } from "@/components/financeiro/dashboard/FinanceiroReceitaDespesa";
import { FinanceiroLancamentosPendentes } from "@/components/financeiro/dashboard/FinanceiroLancamentosPendentes";
import { FinanceiroFaturasVencendo } from "@/components/financeiro/dashboard/FinanceiroFaturasVencendo";
import { FluxoCaixaChart } from "@/components/financeiro/charts/FluxoCaixaChart";
import { ProjecoesChart } from "@/components/financeiro/charts/ProjecoesChart";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useLancamentosFinanceiros } from "@/hooks/lancamentos/useLancamentosFinanceiros";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatarMoeda } from "@/utils/formatters";

export default function Financeiro() {
  const [periodoSelecionado, setPeriodoSelecionado] = useState<'mes' | 'trimestre' | 'ano'>('mes');
  const { 
    selectedDate, 
    handlePreviousMonth, 
    handleNextMonth 
  } = useMonthSelection();

  // Buscar métricas gerais via hook existente
  const { data: dashboardData, isLoading: isLoadingDashboard } = useDashboardData();
  
  // Buscar lançamentos para este mês
  const { data: receitas } = useLancamentosFinanceiros({
    tipo: 'receita',
    status: 'todos',
  });

  const { data: despesas } = useLancamentosFinanceiros({
    tipo: 'despesa',
    status: 'todos',
  });

  // Calcular totais de receitas e despesas
  const totalReceitas = receitas?.reduce((acc, curr) => acc + curr.valor, 0) || 0;
  const totalDespesas = despesas?.reduce((acc, curr) => acc + curr.valor, 0) || 0;
  const saldo = totalReceitas - totalDespesas;
  
  // Calcular receitas e despesas pendentes
  const receitasPendentes = receitas?.filter(r => r.status === 'pendente').reduce((acc, curr) => acc + curr.valor, 0) || 0;
  const despesasPendentes = despesas?.filter(d => d.status === 'pendente').reduce((acc, curr) => acc + curr.valor, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Financeiro</h1>
        
        <div className="flex items-center gap-4">
          <MonthSelector
            currentDate={selectedDate}
            onPreviousMonth={handlePreviousMonth}
            onNextMonth={handleNextMonth}
            className="bg-white rounded-lg shadow-sm"
          />
          
          <Tabs defaultValue="mes" className="w-auto">
            <TabsList>
              <TabsTrigger value="mes" onClick={() => setPeriodoSelecionado('mes')}>
                Mês
              </TabsTrigger>
              <TabsTrigger value="trimestre" onClick={() => setPeriodoSelecionado('trimestre')}>
                Trimestre
              </TabsTrigger>
              <TabsTrigger value="ano" onClick={() => setPeriodoSelecionado('ano')}>
                Ano
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Resumo Visual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={saldo >= 0 ? "border-l-4 border-l-green-500" : "border-l-4 border-l-red-500"}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Saldo do Período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {formatarMoeda(saldo)}
              </div>
              {saldo >= 0 ? 
                <TrendingUp className="h-8 w-8 text-green-500" /> : 
                <TrendingDown className="h-8 w-8 text-red-500" />
              }
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {format(selectedDate, "MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Receitas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-green-600">
                {formatarMoeda(totalReceitas)}
              </div>
              <ArrowDownCircle className="h-8 w-8 text-green-500" />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Pendente: {formatarMoeda(receitasPendentes)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Despesas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-red-600">
                {formatarMoeda(totalDespesas)}
              </div>
              <ArrowUpCircle className="h-8 w-8 text-red-500" />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Pendente: {formatarMoeda(despesasPendentes)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos e Detalhes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Fluxo de Caixa</CardTitle>
            <CardDescription>Entradas e saídas ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <FluxoCaixaChart 
              receitas={receitas || []}
              despesas={despesas || []}
              periodo={periodoSelecionado}
              selectedDate={selectedDate}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Lançamentos Pendentes</CardTitle>
              <CardDescription>A vencer nos próximos 7 dias</CardDescription>
            </div>
            <Link to="/financeiro/contas-pagar">
              <Button variant="ghost" size="sm">Ver todos</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <FinanceiroLancamentosPendentes 
              receitas={receitas || []} 
              despesas={despesas || []} 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Projeções Financeiras</CardTitle>
              <CardDescription>Próximos 3 meses</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ProjecoesChart 
              receitas={receitas || []} 
              despesas={despesas || []} 
              selectedDate={selectedDate}
            />
          </CardContent>
        </Card>
      </div>

      {/* Cards de Acesso Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/financeiro/contas-receber">
          <Card className="hover:bg-gray-50 cursor-pointer transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-green-500 bg-green-50 p-1.5 rounded-lg" />
                <div>
                  <h3 className="font-medium">Contas a Receber</h3>
                  <p className="text-sm text-gray-500">Gestão de recebimentos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/financeiro/contas-pagar">
          <Card className="hover:bg-gray-50 cursor-pointer transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Wallet className="h-8 w-8 text-red-500 bg-red-50 p-1.5 rounded-lg" />
                <div>
                  <h3 className="font-medium">Contas a Pagar</h3>
                  <p className="text-sm text-gray-500">Gestão de pagamentos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/faturas">
          <Card className="hover:bg-gray-50 cursor-pointer transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-violet-500 bg-violet-50 p-1.5 rounded-lg" />
                <div>
                  <h3 className="font-medium">Faturas</h3>
                  <p className="text-sm text-gray-500">Gerenciar faturas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
