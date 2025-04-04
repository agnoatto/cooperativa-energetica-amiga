
/**
 * Componente de Visão Geral de Receitas e Despesas
 * 
 * Exibe um resumo visual das receitas e despesas para o período selecionado,
 * permitindo uma rápida comparação entre valores planejados e realizados.
 */
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LancamentoFinanceiro } from "@/types/financeiro";
import { formatarMoeda } from "@/utils/formatters";

interface FinanceiroReceitaDespesaProps {
  receitas: LancamentoFinanceiro[];
  despesas: LancamentoFinanceiro[];
}

export function FinanceiroReceitaDespesa({ 
  receitas, 
  despesas 
}: FinanceiroReceitaDespesaProps) {
  // Calcular totais
  const totalReceitas = receitas.reduce((acc, curr) => acc + curr.valor, 0);
  const totalDespesas = despesas.reduce((acc, curr) => acc + curr.valor, 0);
  
  // Calcular percentuais
  const total = totalReceitas + totalDespesas;
  const percentualReceitas = total > 0 ? Math.round((totalReceitas / total) * 100) : 0;
  const percentualDespesas = total > 0 ? Math.round((totalDespesas / total) * 100) : 0;
  
  // Dados para o gráfico
  const data = [
    { name: 'Receitas', value: totalReceitas, percentual: percentualReceitas },
    { name: 'Despesas', value: totalDespesas, percentual: percentualDespesas }
  ];
  
  // Cores para o gráfico
  const COLORS = ['#22c55e', '#ef4444']; // Verde e Vermelho
  
  // Formatador para o tooltip
  const renderTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-2 bg-white border rounded shadow-sm">
          <p className="font-medium">{data.name}</p>
          <p>{formatarMoeda(data.value)} ({data.percentual}%)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receitas vs Despesas</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percentual }) => `${name} ${percentual}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={renderTooltip} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-center">
            <p className="text-sm text-gray-500">Receitas</p>
            <p className="text-lg font-bold text-green-600">
              {formatarMoeda(totalReceitas)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Despesas</p>
            <p className="text-lg font-bold text-red-600">
              {formatarMoeda(totalDespesas)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
