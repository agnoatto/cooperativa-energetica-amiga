
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Fatura } from "@/types/fatura";
import { DollarSign, Zap } from "lucide-react";
import { formatarMoeda } from "@/utils/formatters";

interface FaturasDashboardProps {
  faturas: Fatura[] | undefined;
  isLoading: boolean;
}

export function FaturasDashboard({ faturas, isLoading }: FaturasDashboardProps) {
  const valorTotalAssinaturas = faturas?.reduce((acc, fatura) => acc + Number(fatura.valor_assinatura), 0) ?? 0;
  const consumoTotalKwh = faturas?.reduce((acc, fatura) => acc + Number(fatura.consumo_kwh), 0) ?? 0;
  const economiaTotal = faturas?.reduce((acc, fatura) => acc + Number(fatura.valor_desconto), 0) ?? 0;

  const formatarKwh = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Valor Total das Assinaturas
              </p>
              <h2 className="text-2xl font-bold">
                {formatarMoeda(valorTotalAssinaturas)}
              </h2>
            </div>
            <div className="p-4 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Consumo Total
              </p>
              <h2 className="text-2xl font-bold">
                {formatarKwh(consumoTotalKwh)} kWh
              </h2>
            </div>
            <div className="p-4 bg-blue-100 rounded-full">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Economia Total
              </p>
              <h2 className="text-2xl font-bold">
                {formatarMoeda(economiaTotal)}
              </h2>
            </div>
            <div className="p-4 bg-yellow-100 rounded-full">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
