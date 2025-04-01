
/**
 * Dashboard de métricas de pagamentos
 * 
 * Este componente exibe cartes com estatísticas e valores totais relacionados
 * aos pagamentos das usinas fotovoltaicas, como total de geração kWh e valores financeiros.
 */
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Zap, DollarSign } from "lucide-react";
import { PagamentoData } from "./types/pagamento";

interface PagamentosDashboardProps {
  pagamentos: PagamentoData[];
  isLoading: boolean;
}

export function PagamentosDashboard({ pagamentos, isLoading }: PagamentosDashboardProps) {
  const totalKwh = pagamentos.reduce((acc, p) => acc + p.geracao_kwh, 0);
  const totalValor = pagamentos.reduce((acc, p) => acc + p.valor_total, 0);

  const formatarKwh = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Total Gerado
              </p>
              <h2 className="text-2xl font-bold">
                {formatarKwh(totalKwh)} kWh
              </h2>
            </div>
            <div className="p-4 bg-green-100 rounded-full">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Valor Total
              </p>
              <h2 className="text-2xl font-bold">
                {formatarMoeda(totalValor)}
              </h2>
            </div>
            <div className="p-4 bg-blue-100 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
