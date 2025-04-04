
/**
 * Gráfico de Projeções Financeiras
 * 
 * Exibe projeções financeiras para os próximos 3 meses baseado 
 * nos lançamentos recorrentes e planejados do sistema.
 */
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { LancamentoFinanceiro } from "@/types/financeiro";
import { formatarMoeda } from "@/utils/formatters";
import { 
  addMonths, 
  format, 
  parseISO, 
  isSameMonth, 
  isAfter,
  startOfMonth,
  endOfMonth
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface ProjecoesChartProps {
  receitas: LancamentoFinanceiro[];
  despesas: LancamentoFinanceiro[];
  selectedDate: Date;
}

export function ProjecoesChart({ 
  receitas, 
  despesas,
  selectedDate 
}: ProjecoesChartProps) {
  const [data, setData] = useState<any[]>([]);
  
  useEffect(() => {
    // Preparar os dados para projeções dos próximos 3 meses
    const meses = [
      selectedDate,
      addMonths(selectedDate, 1),
      addMonths(selectedDate, 2)
    ];
    
    const projecoes = meses.map(mes => {
      const nome = format(mes, "MMM", { locale: ptBR });
      
      // Filtrar receitas para este mês
      const receitasMes = receitas.filter(r => {
        const dataVencimento = parseISO(r.data_vencimento);
        return isSameMonth(dataVencimento, mes);
      });
      
      // Filtrar despesas para este mês
      const despesasMes = despesas.filter(d => {
        const dataVencimento = parseISO(d.data_vencimento);
        return isSameMonth(dataVencimento, mes);
      });
      
      // Calcular valores pendentes (previstos)
      const receitasPrevistas = receitasMes
        .filter(r => r.status === 'pendente')
        .reduce((sum, item) => sum + item.valor, 0);
        
      const despesasPrevistas = despesasMes
        .filter(d => d.status === 'pendente')
        .reduce((sum, item) => sum + item.valor, 0);
      
      // Calcular valores confirmados
      const receitasConfirmadas = receitasMes
        .filter(r => r.status === 'pago')
        .reduce((sum, item) => sum + item.valor, 0);
        
      const despesasConfirmadas = despesasMes
        .filter(d => d.status === 'pago')
        .reduce((sum, item) => sum + item.valor, 0);
      
      // Calcular saldo projetado
      const saldoProjetado = (receitasConfirmadas + receitasPrevistas) - 
                            (despesasConfirmadas + despesasPrevistas);
      
      return {
        mes: nome,
        mesCompleto: format(mes, "MMMM 'de' yyyy", { locale: ptBR }),
        receitasConfirmadas,
        receitasPrevistas,
        despesasConfirmadas,
        despesasPrevistas,
        saldoProjetado
      };
    });
    
    setData(projecoes);
  }, [receitas, despesas, selectedDate]);
  
  // Configuração do gráfico
  const config = {
    receitasConfirmadas: {
      label: "Receitas Confirmadas",
      theme: { 
        light: "#22c55e", // Verde
        dark: "#16a34a"
      }
    },
    receitasPrevistas: {
      label: "Receitas Previstas",
      theme: { 
        light: "#86efac", // Verde claro
        dark: "#4ade80"
      }
    },
    despesasConfirmadas: {
      label: "Despesas Confirmadas",
      theme: { 
        light: "#ef4444", // Vermelho
        dark: "#dc2626"
      }
    },
    despesasPrevistas: {
      label: "Despesas Previstas",
      theme: { 
        light: "#fca5a5", // Vermelho claro
        dark: "#f87171"
      }
    }
  };

  return (
    <ChartContainer className="h-[300px]" config={config}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mes" />
          <YAxis tickFormatter={(value) => formatarMoeda(value)} />
          <ChartTooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <ChartTooltipContent 
                    active={active} 
                    payload={payload}
                    formatter={(value) => formatarMoeda(Number(value))}
                    labelFormatter={(label) => {
                      const item = data.find(d => d.mes === label);
                      return item ? item.mesCompleto : label;
                    }}
                  />
                );
              }
              return null;
            }}
          />
          <Legend />
          <ReferenceLine y={0} stroke="#000" />
          <Bar 
            dataKey="receitasConfirmadas" 
            name="Receitas Confirmadas" 
            stackId="receitas"
            fill="var(--color-receitasConfirmadas)" 
          />
          <Bar 
            dataKey="receitasPrevistas" 
            name="Receitas Previstas" 
            stackId="receitas"
            fill="var(--color-receitasPrevistas)" 
          />
          <Bar 
            dataKey="despesasConfirmadas" 
            name="Despesas Confirmadas" 
            stackId="despesas"
            fill="var(--color-despesasConfirmadas)" 
          />
          <Bar 
            dataKey="despesasPrevistas" 
            name="Despesas Previstas" 
            stackId="despesas"
            fill="var(--color-despesasPrevistas)" 
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
