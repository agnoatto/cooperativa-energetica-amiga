
/**
 * Dashboard de Contas e Bancos
 * 
 * Componente que exibe gráficos de fluxo financeiro das contas bancárias,
 * mostrando entradas e saídas ao longo do tempo.
 */
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import { format, subMonths, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatarMoeda } from '@/utils/formatters';

interface ContasBancosDashboardProps {
  periodo: 'mes' | 'trimestre' | 'ano';
  selectedDate: Date;
}

// Dados simulados (serão substituídos por dados reais vindos da API)
const gerarDadosMensais = (selectedDate: Date) => {
  const data = [];
  const diasNoMes = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  
  for (let i = 1; i <= diasNoMes; i += 2) {
    const dataAtual = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i);
    data.push({
      data: format(dataAtual, 'dd/MM'),
      entradas: Math.floor(Math.random() * 10000),
      saidas: Math.floor(Math.random() * 8000),
    });
  }
  
  return data;
};

const gerarDadosTrimestrais = (selectedDate: Date) => {
  const data = [];
  
  for (let i = 0; i < 3; i++) {
    const dataAtual = subMonths(selectedDate, i);
    data.push({
      data: format(dataAtual, 'MMM/yy', { locale: ptBR }),
      entradas: Math.floor(Math.random() * 30000),
      saidas: Math.floor(Math.random() * 25000),
    });
  }
  
  return data.reverse();
};

const gerarDadosAnuais = (selectedDate: Date) => {
  const data = [];
  const anoAtual = selectedDate.getFullYear();
  
  for (let i = 0; i < 12; i++) {
    data.push({
      data: format(new Date(anoAtual, i, 1), 'MMM', { locale: ptBR }),
      entradas: Math.floor(Math.random() * 120000),
      saidas: Math.floor(Math.random() * 100000),
    });
  }
  
  return data;
};

export function ContasBancosDashboard({ periodo, selectedDate }: ContasBancosDashboardProps) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    
    // Simular carregamento de dados
    setTimeout(() => {
      let dadosGerados;
      
      switch (periodo) {
        case 'mes':
          dadosGerados = gerarDadosMensais(selectedDate);
          break;
        case 'trimestre':
          dadosGerados = gerarDadosTrimestrais(selectedDate);
          break;
        case 'ano':
          dadosGerados = gerarDadosAnuais(selectedDate);
          break;
        default:
          dadosGerados = gerarDadosMensais(selectedDate);
      }
      
      setData(dadosGerados);
      setIsLoading(false);
    }, 1000);
  }, [periodo, selectedDate]);

  if (isLoading) {
    return (
      <div className="w-full h-80">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="data" />
          <YAxis
            tickFormatter={(value) => formatarMoeda(value, { notation: 'compact' })}
          />
          <Tooltip 
            formatter={(value: number) => formatarMoeda(value)}
            labelFormatter={(label) => `Data: ${label}`}
          />
          <Legend />
          <Bar 
            dataKey="entradas" 
            name="Entradas" 
            fill="#10b981" 
            radius={[4, 4, 0, 0]} 
          />
          <Bar 
            dataKey="saidas" 
            name="Saídas" 
            fill="#ef4444" 
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
