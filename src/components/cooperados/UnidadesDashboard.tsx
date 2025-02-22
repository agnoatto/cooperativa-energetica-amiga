
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DashboardData {
  total_cooperados: number;
  total_consumo: number;
}

export function UnidadesDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["unidades-dashboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cooperados')
        .select(`
          id,
          unidades_beneficiarias:unidades_beneficiarias(consumo_kwh)
        `)
        .is('data_exclusao', null)
        .throwOnError();
      
      if (!data) return { total_cooperados: 0, total_consumo: 0 };
      
      const total_cooperados = data.length;
      const total_consumo = data.reduce((acc, cooperado) => {
        const consumo = cooperado.unidades_beneficiarias?.reduce(
          (sum: number, unidade: any) => sum + (unidade.consumo_kwh || 0), 
          0
        ) || 0;
        return acc + consumo;
      }, 0);

      return { total_cooperados, total_consumo };
    },
  });

  const formatarKwh = (valor: number) => {
    return valor?.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) ?? '0,00';
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
                Total de Cooperados
              </p>
              <h2 className="text-2xl font-bold">
                {data?.total_cooperados ?? 0}
              </h2>
            </div>
            <div className="p-4 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
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
                {formatarKwh(data?.total_consumo ?? 0)} kWh
              </h2>
            </div>
            <div className="p-4 bg-green-100 rounded-full">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
