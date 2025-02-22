
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BatteryCharging, Factory, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatarKwh } from "@/utils/formatters";
import { usinaKeys } from "../hooks/useUsinas";

interface DashboardData {
  total_usinas: number;
  geracao_media: number;
  potencia_total: number;
}

export function UsinasDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: usinaKeys.dashboard(),
    queryFn: async () => {
      const { data: usinas, error } = await supabase
        .from('usinas')
        .select(`
          id,
          potencia_instalada,
          pagamentos_usina(
            geracao_kwh
          )
        `)
        .is('deleted_at', null)
        .eq('status', 'active')
        .throwOnError();

      if (!usinas) return {
        total_usinas: 0,
        geracao_media: 0,
        potencia_total: 0
      };

      // Calcular total de usinas
      const total_usinas = usinas.length;

      // Calcular potência total instalada
      const potencia_total = usinas.reduce(
        (sum, usina) => sum + (usina.potencia_instalada || 0),
        0
      );

      // Calcular geração média
      let totalGeracao = 0;
      let totalMeses = 0;

      usinas.forEach(usina => {
        if (usina.pagamentos_usina && usina.pagamentos_usina.length > 0) {
          usina.pagamentos_usina.forEach((pagamento: any) => {
            if (pagamento.geracao_kwh) {
              totalGeracao += pagamento.geracao_kwh;
              totalMeses++;
            }
          });
        }
      });

      const geracao_media = totalMeses > 0 ? totalGeracao / totalMeses : 0;

      return {
        total_usinas,
        geracao_media,
        potencia_total
      };
    }
  });

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
                Total de Usinas
              </p>
              <h2 className="text-2xl font-bold">
                {data?.total_usinas ?? 0}
              </h2>
            </div>
            <div className="p-4 bg-blue-100 rounded-full">
              <Factory className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Geração Média
              </p>
              <h2 className="text-2xl font-bold">
                {formatarKwh(data?.geracao_media ?? 0)} kWh
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
                Potência Instalada
              </p>
              <h2 className="text-2xl font-bold">
                {formatarKwh(data?.potencia_total ?? 0)} kWp
              </h2>
            </div>
            <div className="p-4 bg-yellow-100 rounded-full">
              <BatteryCharging className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
