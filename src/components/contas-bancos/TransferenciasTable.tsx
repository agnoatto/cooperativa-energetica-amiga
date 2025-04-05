
/**
 * Componente de Tabela de Transferências
 * 
 * Este componente exibe as transferências bancárias em formato de tabela
 * para visualização em dispositivos desktop.
 */
import { TransferenciaBancaria } from "@/types/contas-bancos";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatarMoeda } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TransferenciasTableProps {
  transferencias: TransferenciaBancaria[];
  isLoading: boolean;
}

export function TransferenciasTable({ transferencias, isLoading }: TransferenciasTableProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </Card>
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
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Origem</TableHead>
              <TableHead>Destino</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transferencias.map((transferencia) => {
              // Determinar o tipo de transferência
              let tipoTransferencia = "interna";
              if (transferencia.conta_origem_id && !transferencia.conta_destino_id) {
                tipoTransferencia = "saida";
              } else if (!transferencia.conta_origem_id && transferencia.conta_destino_id) {
                tipoTransferencia = "entrada";
              }
              
              return (
                <TableRow key={transferencia.id}>
                  <TableCell>
                    {format(new Date(transferencia.data_transferencia), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>{transferencia.descricao}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      tipoTransferencia === "interna" && "bg-blue-50 text-blue-700 border-blue-200",
                      tipoTransferencia === "entrada" && "bg-green-50 text-green-700 border-green-200",
                      tipoTransferencia === "saida" && "bg-amber-50 text-amber-700 border-amber-200",
                    )}>
                      {tipoTransferencia === "interna" && "Transferência Interna"}
                      {tipoTransferencia === "entrada" && "Entrada/Depósito"}
                      {tipoTransferencia === "saida" && "Saída/Saque"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {transferencia.conta_origem?.nome || "-"}
                  </TableCell>
                  <TableCell>
                    {transferencia.conta_destino?.nome || "-"}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatarMoeda(transferencia.valor)}
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
