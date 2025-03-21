
/**
 * Dashboard de Faturas 
 * 
 * Este componente exibe métricas resumidas sobre as faturas do período atual,
 * incluindo o consumo total em kWh e o valor total das assinaturas.
 */
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Fatura } from "@/types/fatura";
import { Zap, DollarSign } from "lucide-react";
import { formatarMoeda, formatarKwh } from "@/utils/formatters";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface FaturasDashboardProps {
  faturas: Fatura[] | undefined;
  isLoading: boolean;
  currentDate: Date;
}

export function FaturasDashboard({ faturas, isLoading, currentDate }: FaturasDashboardProps) {
  // Formatar o mês e ano atual para exibição
  const mesAnoFormatado = format(currentDate, "MMMM 'de' yyyy", { locale: ptBR });
  
  // Calcular o valor total das assinaturas
  const valorAssinaturas = faturas?.reduce((acc, fatura) => 
    acc + Number(fatura.valor_assinatura), 0) ?? 0;
  
  // Calcular o consumo total em kWh
  const consumoTotal = faturas?.reduce((acc, fatura) => 
    acc + Number(fatura.consumo_kwh), 0) ?? 0;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-center">
        Resumo de Faturas - {mesAnoFormatado}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Consumo Total
                </p>
                <h2 className="text-2xl font-bold">
                  {formatarKwh(consumoTotal)} kWh
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
                  Valor de Assinatura
                </p>
                <h2 className="text-2xl font-bold">
                  {formatarMoeda(valorAssinaturas)}
                </h2>
              </div>
              <div className="p-4 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
