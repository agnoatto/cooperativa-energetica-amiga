
/**
 * Tabela de Transferências
 * 
 * Exibe uma tabela com todas as transferências realizadas entre contas,
 * incluindo depósitos, saques e transferências internas.
 */
import { TransferenciaBancaria } from "@/types/contas-bancos";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  MoreHorizontal,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { formatarMoeda } from "@/utils/formatters";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

interface TransferenciasTableProps {
  transferencias: TransferenciaBancaria[];
  isLoading: boolean;
}

export function TransferenciasTable({ transferencias, isLoading }: TransferenciasTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2 mt-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
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
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Origem / Destino</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transferencias.map((transferencia) => {
            const tipoInfo = getTipoTransferencia(transferencia);
            
            return (
              <TableRow key={transferencia.id}>
                <TableCell className="whitespace-nowrap">
                  {format(new Date(transferencia.data_transferencia), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  {transferencia.descricao || "Sem descrição"}
                </TableCell>
                <TableCell>
                  {transferencia.conta_origem && (
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: transferencia.conta_origem.cor || '#3b82f6' }}
                        />
                        <span className="font-medium">De: {transferencia.conta_origem.nome}</span>
                      </div>
                    </div>
                  )}
                  
                  {transferencia.conta_destino && (
                    <div className="text-sm mt-1">
                      <div className="flex items-center gap-1">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: transferencia.conta_destino.cor || '#3b82f6' }}
                        />
                        <span className="font-medium">Para: {transferencia.conta_destino.nome}</span>
                      </div>
                    </div>
                  )}
                  
                  {!transferencia.conta_origem && !transferencia.conta_destino && (
                    <span className="text-sm text-gray-500">Externa</span>
                  )}
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatarMoeda(transferencia.valor)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[200px]">
                        <Link to={`/financeiro/contas-bancos/transferencias/${transferencia.id}`}>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" /> Ver detalhes
                          </DropdownMenuItem>
                        </Link>
                        
                        {transferencia.status === 'pendente' && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" /> Concluir
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <XCircle className="h-4 w-4 mr-2 text-red-600" /> Cancelar
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
