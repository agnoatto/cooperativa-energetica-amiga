
/**
 * Componente de Cards de Transferências
 * 
 * Este componente exibe as transferências bancárias em formato de cards
 * para visualização em dispositivos móveis.
 */
import { TransferenciaBancaria } from "@/types/contas-bancos";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatarMoeda } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from "lucide-react";

interface TransferenciasCardsProps {
  transferencias: TransferenciaBancaria[];
  isLoading: boolean;
}

export function TransferenciasCards({ transferencias, isLoading }: TransferenciasCardsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-6 w-1/4" />
                </div>
                <Skeleton className="h-4 w-2/3" />
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

  if (transferencias.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500">Nenhuma transferência encontrada.</p>
        <p className="text-sm text-gray-400 mt-1">Tente ajustar os filtros ou realizar uma nova transferência.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {transferencias.map((transferencia) => {
        // Determinar o tipo de transferência
        let tipoTransferencia = "interna";
        if (transferencia.conta_origem_id && !transferencia.conta_destino_id) {
          tipoTransferencia = "saida";
        } else if (!transferencia.conta_origem_id && transferencia.conta_destino_id) {
          tipoTransferencia = "entrada";
        }
        
        return (
          <Card key={transferencia.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    {format(new Date(transferencia.data_transferencia), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </div>
                  <Badge className={cn(
                    transferencia.status === "pendente" && "bg-yellow-100 text-yellow-800",
                    transferencia.status === "concluida" && "bg-green-100 text-green-800",
                    transferencia.status === "cancelada" && "bg-gray-100 text-gray-800",
                    transferencia.status === "falha" && "bg-red-100 text-red-800",
                  )}>
                    {transferencia.status === "pendente" && "Pendente"}
                    {transferencia.status === "concluida" && "Concluída"}
                    {transferencia.status === "cancelada" && "Cancelada"}
                    {transferencia.status === "falha" && "Falha"}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2">
                  {tipoTransferencia === "interna" && (
                    <ArrowLeftRight className="h-4 w-4 text-blue-500" />
                  )}
                  {tipoTransferencia === "entrada" && (
                    <ArrowDownLeft className="h-4 w-4 text-green-500" />
                  )}
                  {tipoTransferencia === "saida" && (
                    <ArrowUpRight className="h-4 w-4 text-amber-500" />
                  )}
                  <div className="font-medium">{transferencia.descricao}</div>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <div className="text-sm">
                    {tipoTransferencia === "interna" && (
                      <div className="flex flex-col">
                        <span className="text-gray-500">De: {transferencia.conta_origem?.nome}</span>
                        <span className="text-gray-500">Para: {transferencia.conta_destino?.nome}</span>
                      </div>
                    )}
                    {tipoTransferencia === "entrada" && (
                      <div className="text-gray-500">Para: {transferencia.conta_destino?.nome}</div>
                    )}
                    {tipoTransferencia === "saida" && (
                      <div className="text-gray-500">De: {transferencia.conta_origem?.nome}</div>
                    )}
                  </div>
                  <div className={cn(
                    "text-lg font-bold",
                    tipoTransferencia === "entrada" && "text-green-600",
                    tipoTransferencia === "saida" && "text-red-600",
                    tipoTransferencia === "interna" && "text-blue-600"
                  )}>
                    {formatarMoeda(transferencia.valor)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
