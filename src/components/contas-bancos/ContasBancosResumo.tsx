
/**
 * Componente de Resumo de Contas e Bancos
 * 
 * Este componente exibe um resumo das contas bancárias, incluindo
 * saldos, status e informações básicas de cada conta.
 */
import { formatarMoeda } from "@/utils/formatters";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ContaBancaria } from "@/types/contas-bancos";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Wallet, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContasBancosResumoProps {
  contas: ContaBancaria[];
  isLoading: boolean;
}

export function ContasBancosResumo({ contas, isLoading }: ContasBancosResumoProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="space-y-3">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-3/4" />
                <div className="flex items-center justify-between mt-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-6 w-1/3" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (contas.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">Não há contas bancárias cadastradas.</p>
        <p className="text-sm text-gray-400 mt-1">Cadastre uma conta para começar a gerenciá-la.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {contas.map((conta) => (
        <Card 
          key={conta.id} 
          className={cn(
            "overflow-hidden border-l-4",
            conta.status === 'ativa' ? "border-l-blue-500" : "border-l-gray-300"
          )}
        >
          <CardContent className="p-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {conta.tipo === 'corrente' && <CreditCard className="h-4 w-4 text-blue-500" />}
                  {conta.tipo === 'poupanca' && <Wallet className="h-4 w-4 text-green-500" />}
                  {conta.tipo === 'investimento' && <BarChart3 className="h-4 w-4 text-purple-500" />}
                  {conta.tipo === 'caixa' && <Wallet className="h-4 w-4 text-amber-500" />}
                  <span className="text-sm font-medium text-gray-600">
                    {conta.tipo === 'corrente' && 'Conta Corrente'}
                    {conta.tipo === 'poupanca' && 'Poupança'}
                    {conta.tipo === 'investimento' && 'Investimento'}
                    {conta.tipo === 'caixa' && 'Caixa'}
                  </span>
                </div>
                <Badge 
                  className={cn(
                    conta.status === 'ativa' && "bg-green-100 text-green-800 hover:bg-green-100",
                    conta.status === 'inativa' && "bg-gray-100 text-gray-800 hover:bg-gray-100",
                    conta.status === 'bloqueada' && "bg-red-100 text-red-800 hover:bg-red-100",
                  )}
                >
                  {conta.status === 'ativa' && 'Ativa'}
                  {conta.status === 'inativa' && 'Inativa'}
                  {conta.status === 'bloqueada' && 'Bloqueada'}
                </Badge>
              </div>
              
              <h3 className="text-lg font-semibold">{conta.nome}</h3>
              
              {conta.tipo !== 'caixa' && (
                <div className="text-xs text-gray-500">
                  {conta.banco} • Ag: {conta.agencia} • CC: {conta.conta}-{conta.digito}
                </div>
              )}
              
              <div className="pt-2 flex justify-between items-end">
                <div className="text-sm text-gray-500">Saldo Atual</div>
                <div className="text-xl font-bold text-gray-900">{formatarMoeda(conta.saldo_atual)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
