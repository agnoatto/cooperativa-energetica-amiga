
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
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  Wallet, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  AlertCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TransferenciasCardsProps {
  transferencias: TransferenciaBancaria[];
  isLoading: boolean;
  onAprovar?: (transferencia: TransferenciaBancaria) => void;
  onCancelar?: (transferencia: TransferenciaBancaria) => void;
}

export function TransferenciasCards({ 
  transferencias, 
  isLoading,
  onAprovar,
  onCancelar
}: TransferenciasCardsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
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
          <Card 
            key={transferencia.id} 
            className={cn(
              "overflow-hidden border-l-4",
              tipoTransferencia === "interna" && "border-l-blue-500",
              tipoTransferencia === "entrada" && "border-l-green-500",
              tipoTransferencia === "saida" && "border-l-amber-500",
            )}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <Badge 
                  variant="outline" 
                  className={cn(
                    tipoTransferencia === "interna" && "bg-blue-50 text-blue-700 border-blue-200",
                    tipoTransferencia === "entrada" && "bg-green-50 text-green-700 border-green-200",
                    tipoTransferencia === "saida" && "bg-amber-50 text-amber-700 border-amber-200",
                  )}
                >
                  {tipoTransferencia === "interna" && "Transferência Interna"}
                  {tipoTransferencia === "entrada" && "Entrada/Depósito"}
                  {tipoTransferencia === "saida" && "Saída/Saque"}
                </Badge>
                
                <Badge 
                  className={cn(
                    transferencia.status === "pendente" && "bg-yellow-100 text-yellow-800",
                    transferencia.status === "concluida" && "bg-green-100 text-green-800",
                    transferencia.status === "cancelada" && "bg-gray-100 text-gray-800",
                    transferencia.status === "falha" && "bg-red-100 text-red-800",
                  )}
                >
                  {transferencia.status === "pendente" && "Pendente"}
                  {transferencia.status === "concluida" && "Concluída"}
                  {transferencia.status === "cancelada" && "Cancelada"}
                  {transferencia.status === "falha" && "Falha"}
                </Badge>
              </div>
              
              <h3 className="font-medium">{transferencia.descricao}</h3>
              
              <div className="text-sm text-gray-500 mt-1">
                {format(new Date(transferencia.data_transferencia), "dd/MM/yyyy", { locale: ptBR })}
              </div>
              
              {/* Contas de origem e destino */}
              <div className="mt-3">
                {transferencia.conta_origem && (
                  <div className="flex items-center gap-2 text-sm">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Origem:</span>
                    <span>{transferencia.conta_origem.nome}</span>
                  </div>
                )}
                
                {transferencia.conta_origem && transferencia.conta_destino && (
                  <ArrowRight className="h-4 w-4 text-gray-400 my-1 ml-4" />
                )}
                
                {transferencia.conta_destino && (
                  <div className="flex items-center gap-2 text-sm">
                    <Wallet className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Destino:</span>
                    <span>{transferencia.conta_destino.nome}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-3 pt-2 border-t flex justify-between items-center">
                <div className="text-lg font-bold">{formatarMoeda(transferencia.valor)}</div>
                
                {transferencia.status === 'pendente' && (onAprovar || onCancelar) && (
                  <div className="flex gap-1">
                    {onAprovar && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-green-600 border-green-200 hover:bg-green-50"
                        onClick={() => onAprovar(transferencia)}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Aprovar
                      </Button>
                    )}
                    
                    {onCancelar && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => onCancelar(transferencia)}
                      >
                        <XCircle className="h-4 w-4 mr-1" /> Cancelar
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
