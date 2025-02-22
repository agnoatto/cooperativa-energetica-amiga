
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LancamentoFinanceiro } from "@/types/financeiro";
import { formatarMoeda } from "@/utils/formatters";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

interface LancamentosDashboardProps {
  lancamentos?: LancamentoFinanceiro[];
}

export function LancamentosDashboard({ lancamentos }: LancamentosDashboardProps) {
  const totalPendente = lancamentos
    ?.filter(l => l.status === 'pendente')
    .reduce((acc, curr) => acc + curr.valor, 0) || 0;

  const totalPago = lancamentos
    ?.filter(l => l.status === 'pago')
    .reduce((acc, curr) => acc + curr.valor, 0) || 0;

  const totalAtrasado = lancamentos
    ?.filter(l => l.status === 'atrasado')
    .reduce((acc, curr) => acc + curr.valor, 0) || 0;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pendente</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatarMoeda(totalPendente)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pago</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatarMoeda(totalPago)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Atrasado</CardTitle>
          <AlertCircle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatarMoeda(totalAtrasado)}</div>
        </CardContent>
      </Card>
    </div>
  );
}
