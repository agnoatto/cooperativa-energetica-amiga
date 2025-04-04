
/**
 * Gráfico de Fluxo de Caixa
 * 
 * Exibe um gráfico de área para visualizar o fluxo de caixa (receitas e despesas)
 * ao longo de um período de tempo, com opções para visualizar por mês, trimestre ou ano.
 */
import { useState, useEffect } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  startOfYear,
  endOfYear,
  startOfQuarter,
  endOfQuarter,
  format,
  isWithinInterval,
  parseISO
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { LancamentoFinanceiro } from "@/types/financeiro";
import { formatarMoeda } from "@/utils/formatters";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface FluxoCaixaChartProps {
  receitas: LancamentoFinanceiro[];
  despesas: LancamentoFinanceiro[];
  periodo: 'mes' | 'trimestre' | 'ano';
  selectedDate: Date;
}

export function FluxoCaixaChart({ 
  receitas, 
  despesas,
  periodo,
  selectedDate
}: FluxoCaixaChartProps) {
  const [data, setData] = useState<any[]>([]);
  
  useEffect(() => {
    const processarDados = () => {
      let intervalDates: Date[] = [];
      let formatoData = '';
      
      // Definir intervalo e formato baseado no período
      if (periodo === 'mes') {
        const inicio = startOfMonth(selectedDate);
        const fim = endOfMonth(selectedDate);
        intervalDates = eachDayOfInterval({ start: inicio, end: fim });
        formatoData = 'dd/MM';
      } else if (periodo === 'trimestre') {
        const inicio = startOfQuarter(selectedDate);
        const fim = endOfQuarter(selectedDate);
        intervalDates = eachWeekOfInterval({ start: inicio, end: fim });
        formatoData = "'Sem' w"; // Semana do ano
      } else if (periodo === 'ano') {
        const inicio = startOfYear(selectedDate);
        const fim = endOfYear(selectedDate);
        intervalDates = eachMonthOfInterval({ start: inicio, end: fim });
        formatoData = "MMM"; // Mês abreviado
      }
      
      // Mapear datas para o formato de dados do gráfico
      const chartData = intervalDates.map(date => {
        // Filtrar lançamentos dentro do intervalo
        const receitasDia = receitas.filter(r => {
          const dataVencimento = parseISO(r.data_vencimento);
          
          if (periodo === 'mes') {
            // Comparação diária
            return format(dataVencimento, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
          } else if (periodo === 'trimestre') {
            // Comparação semanal (mesma semana)
            const inicioSemana = date;
            const fimSemana = new Date(date.getTime() + 6 * 24 * 60 * 60 * 1000); // Adicionar 6 dias
            return isWithinInterval(dataVencimento, { start: inicioSemana, end: fimSemana });
          } else {
            // Comparação mensal (mesmo mês)
            return (
              dataVencimento.getMonth() === date.getMonth() && 
              dataVencimento.getFullYear() === date.getFullYear()
            );
          }
        });
        
        const despesasDia = despesas.filter(d => {
          const dataVencimento = parseISO(d.data_vencimento);
          
          if (periodo === 'mes') {
            return format(dataVencimento, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
          } else if (periodo === 'trimestre') {
            const inicioSemana = date;
            const fimSemana = new Date(date.getTime() + 6 * 24 * 60 * 60 * 1000);
            return isWithinInterval(dataVencimento, { start: inicioSemana, end: fimSemana });
          } else {
            return (
              dataVencimento.getMonth() === date.getMonth() && 
              dataVencimento.getFullYear() === date.getFullYear()
            );
          }
        });
        
        // Calcular totais
        const totalReceitas = receitasDia.reduce((sum, item) => sum + item.valor, 0);
        const totalDespesas = despesasDia.reduce((sum, item) => sum + item.valor, 0);
        const saldo = totalReceitas - totalDespesas;
        
        return {
          data: format(date, formatoData, { locale: ptBR }),
          dataCompleta: format(date, 'dd/MM/yyyy'),
          receitas: totalReceitas,
          despesas: totalDespesas,
          saldo
        };
      });
      
      setData(chartData);
    };
    
    processarDados();
  }, [receitas, despesas, periodo, selectedDate]);
  
  // Configuração do gráfico
  const config = {
    receitas: {
      label: "Receitas",
      theme: {
        light: "rgba(34, 197, 94, 0.6)",  // Verde com transparência
        dark: "rgba(34, 197, 94, 0.7)"
      }
    },
    despesas: {
      label: "Despesas",
      theme: {
        light: "rgba(239, 68, 68, 0.6)",  // Vermelho com transparência
        dark: "rgba(239, 68, 68, 0.7)"
      }
    },
    saldo: {
      label: "Saldo",
      theme: {
        light: "rgba(99, 102, 241, 0.6)", // Azul-violeta com transparência
        dark: "rgba(99, 102, 241, 0.7)"
      }
    }
  };
  
  // Formatador para o tooltip
  const formatadorTooltip = (value: number) => {
    return formatarMoeda(value);
  };

  return (
    <ChartContainer className="h-[300px]" config={config}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="data" 
            fontSize={12}
            tickMargin={10}
          />
          <YAxis 
            tickFormatter={formatadorTooltip}
            fontSize={12}
          />
          <ChartTooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <ChartTooltipContent 
                    active={active} 
                    payload={payload}
                    formatter={(value) => formatarMoeda(Number(value))}
                    labelFormatter={(label) => {
                      const item = data.find(d => d.data === label);
                      return item ? item.dataCompleta : label;
                    }}
                  />
                );
              }
              return null;
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="receitas"
            name="Receitas"
            stroke="#22c55e"
            fill="var(--color-receitas)"
            activeDot={{ r: 4 }}
          />
          <Area
            type="monotone"
            dataKey="despesas"
            name="Despesas"
            stroke="#ef4444"
            fill="var(--color-despesas)"
            activeDot={{ r: 4 }}
          />
          <Area
            type="monotone"
            dataKey="saldo"
            name="Saldo"
            stroke="#6366f1"
            fill="var(--color-saldo)"
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
