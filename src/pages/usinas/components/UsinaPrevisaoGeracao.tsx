
// Este componente apresenta os gráficos de previsão de geração da usina
// Exibe dados históricos e projeções de geração por mês

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from "recharts";
import { PrevisaoUsina } from "../hooks/useUsinaPrevisoes";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UsinaPrevisaoGeracaoProps {
  previsoes?: PrevisaoUsina[];
  isLoading: boolean;
}

export function UsinaPrevisaoGeracao({ previsoes, isLoading }: UsinaPrevisaoGeracaoProps) {
  const [anoSelecionado, setAnoSelecionado] = useState<string>(() => {
    if (!previsoes?.length) return new Date().getFullYear().toString();
    return previsoes[0].ano.toString();
  });

  function getNomeMes(numeroMes: number) {
    const data = new Date(2000, numeroMes - 1, 1);
    return format(data, 'MMM', { locale: ptBR });
  }

  const anos = previsoes 
    ? [...new Set(previsoes.map(p => p.ano))]
        .sort((a, b) => b - a) // ordem decrescente
    : [];

  const previsaoSelecionada = previsoes?.find(p => p.ano.toString() === anoSelecionado);

  const gerarDadosGrafico = () => {
    if (!previsaoSelecionada) return [];

    return [
      { name: getNomeMes(1), geracao: previsaoSelecionada.janeiro },
      { name: getNomeMes(2), geracao: previsaoSelecionada.fevereiro },
      { name: getNomeMes(3), geracao: previsaoSelecionada.marco },
      { name: getNomeMes(4), geracao: previsaoSelecionada.abril },
      { name: getNomeMes(5), geracao: previsaoSelecionada.maio },
      { name: getNomeMes(6), geracao: previsaoSelecionada.junho },
      { name: getNomeMes(7), geracao: previsaoSelecionada.julho },
      { name: getNomeMes(8), geracao: previsaoSelecionada.agosto },
      { name: getNomeMes(9), geracao: previsaoSelecionada.setembro },
      { name: getNomeMes(10), geracao: previsaoSelecionada.outubro },
      { name: getNomeMes(11), geracao: previsaoSelecionada.novembro },
      { name: getNomeMes(12), geracao: previsaoSelecionada.dezembro },
    ];
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!previsoes?.length) {
    return (
      <div className="text-center py-8 border rounded-md">
        <p className="text-muted-foreground">Nenhuma previsão de geração cadastrada</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Previsão de Geração</CardTitle>
        <Select 
          value={anoSelecionado} 
          onValueChange={setAnoSelecionado}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Selecionar ano" />
          </SelectTrigger>
          <SelectContent>
            {anos.map(ano => (
              <SelectItem key={ano} value={ano.toString()}>
                {ano}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={gerarDadosGrafico()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis 
              tickFormatter={(value) => `${value} kWh`}
              label={{ value: 'kWh', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip formatter={(value) => [`${value} kWh`, 'Geração']} />
            <Legend />
            <Bar dataKey="geracao" fill="#4f46e5" name="Geração Prevista (kWh)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
