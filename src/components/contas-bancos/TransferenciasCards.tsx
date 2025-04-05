
/**
 * Cards de Transferências para visualização mobile
 * 
 * Exibe as transferências bancárias em formato de cartões, otimizado
 * para dispositivos móveis. Mostra informações como valor, data, status
 * e informações das contas envolvidas.
 */
import { TransferenciaBancaria } from "@/types/contas-bancos";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { formatarMoeda } from "@/utils/formatters";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  Eye,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface TransferenciasCardsProps {
  transferencias: TransferenciaBancaria[];
  isLoading: boolean;
}

export function TransferenciasCards({ transferencias, isLoading }: TransferenciasCardsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 mt-2">
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-36 w-full" />
      </div>
    );
  }

  if (transferencias.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Nenhuma transferência encontrada.</p>
        <Link to="/financeiro/contas-bancos/transferencias/cadastrar">
          <Button>
            <ArrowLeftRight className="mr-2 h-4 w-4" />
            Nova Transferência
          </Button>
        </Link>
      </div>
    );
  }

  const getTipoTransferencia = (transferencia: TransferenciaBancaria) => {
    if (transferencia.conta_origem_id && transferencia.conta_destino_id) {
      return { tipo: 'interna', label: 'Transferência Interna', icon: <ArrowLeftRight className="h-4 w-4 mr-2" /> };
    } else if (transferencia.conta_origem_id && !transferencia.conta_destino_id) {
      return { tipo: 'saida', label: 'Saída/Saque', icon: <ArrowUpRight className="h-4 w-4 mr-2 text-red-600" /> };
    } else if (!transferencia.conta_origem_id && transferencia.conta_destino_id) {
      return { tipo: 'entrada', label: 'Entrada/Depósito', icon: <ArrowDownLeft className="h-4 w-4 mr-2 text-green-600" /> };
    } else {
      return { tipo: 'externa', label: 'Transferência Externa', icon: <ArrowLeftRight className="h-4 w-4 mr-2" /> };
    }
  };

  return (
    <div className="space-y-4">
      {transferencias.map((transferencia) => {
        const tipoInfo = getTipoTransferencia(transferencia);
        
        return (
          <Card key={transferencia.id} className={cn(
            "overflow-hidden",
            transferencia.status === 'cancelada' && "opacity-70",
            transferencia.status === 'falha' && "opacity-70"
          )}>
            <div className={cn(
              "h-2",
              tipoInfo.tipo === 'entrada' && "bg-green-500",
              tipoInfo.tipo === 'saida' && "bg-red-500",
              tipoInfo.tipo === 'interna' && "bg-blue-500",
              tipoInfo.tipo === 'externa' && "bg-purple-500"
            )} />
            
            <CardContent className="pt-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn(
                      "flex items-center",
                      tipoInfo.tipo === 'entrada' && "bg-green-50 text-green-700 border-green-200",
                      tipoInfo.tipo === 'saida' && "bg-red-50 text-red-700 border-red-200",
                      tipoInfo.tipo === 'interna' && "bg-blue-50 text-blue-700 border-blue-200",
                      tipoInfo.tipo === 'externa' && "bg-purple-50 text-purple-700 border-purple-200"
                    )}>
                      {tipoInfo.icon}
                      {tipoInfo.label}
                    </Badge>
                    
                    <Badge className={cn(
                      transferencia.status === 'concluida' && "bg-green-100 text-green-800 hover:bg-green-100",
                      transferencia.status === 'pendente' && "bg-amber-100 text-amber-800 hover:bg-amber-100",
                      transferencia.status === 'cancelada' && "bg-gray-100 text-gray-800 hover:bg-gray-100",
                      transferencia.status === 'falha' && "bg-red-100 text-red-800 hover:bg-red-100"
                    )}>
                      {transferencia.status === 'concluida' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {transferencia.status === 'pendente' && <Clock className="h-3 w-3 mr-1" />}
                      {transferencia.status === 'cancelada' && <XCircle className="h-3 w-3 mr-1" />}
                      {transferencia.status === 'falha' && <AlertCircle className="h-3 w-3 mr-1" />}
                      
                      {transferencia.status === 'concluida' && 'Concluída'}
                      {transferencia.status === 'pendente' && 'Pendente'}
                      {transferencia.status === 'cancelada' && 'Cancelada'}
                      {transferencia.status === 'falha' && 'Falha'}
                    </Badge>
                  </div>
                  
                  <h3 className="mt-2 font-medium">
                    {transferencia.descricao || "Sem descrição"}
                  </h3>
                  
                  <p className="text-sm text-gray-500 mt-1">
                    {format(new Date(transferencia.data_transferencia), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-xl font-bold">
                    {formatarMoeda(transferencia.valor)}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col mt-2 text-sm">
                {transferencia.conta_origem && (
                  <div className="flex items-center gap-1">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: transferencia.conta_origem.cor || '#3b82f6' }}
                    />
                    <span>De: <span className="font-medium">{transferencia.conta_origem.nome}</span></span>
                  </div>
                )}
                
                {transferencia.conta_destino && (
                  <div className="flex items-center gap-1 mt-1">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: transferencia.conta_destino.cor || '#3b82f6' }}
                    />
                    <span>Para: <span className="font-medium">{transferencia.conta_destino.nome}</span></span>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between bg-gray-50 py-2">
              <Link to={`/financeiro/contas-bancos/transferencias/${transferencia.id}`}>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4 mr-2" /> Detalhes
                </Button>
              </Link>
              
              {transferencia.status === 'pendente' && (
                <>
                  <Button variant="ghost" size="sm" className="text-green-600">
                    <CheckCircle2 className="h-4 w-4 mr-2" /> Concluir
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="text-red-600">
                    <XCircle className="h-4 w-4 mr-2" /> Cancelar
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
