
/**
 * Tabela de Contas Bancárias
 * 
 * Exibe uma tabela com todas as contas bancárias cadastradas,
 * permitindo visualizar detalhes e realizar ações como edição,
 * exclusão e transferências.
 */
import { ContaBancaria } from "@/types/contas-bancos";
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
  ArrowLeftRight, 
  Edit, 
  MoreHorizontal,
  CreditCard,
  Wallet,
  BarChart3,
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { formatarMoeda } from "@/utils/formatters";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

interface ContasBancariasTableProps {
  contas: ContaBancaria[];
  isLoading: boolean;
}

export function ContasBancariasTable({ contas, isLoading }: ContasBancariasTableProps) {
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

  if (contas.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Nenhuma conta bancária cadastrada.</p>
        <Link to="/financeiro/contas-bancos/contas/cadastrar">
          <Button>
            <CreditCard className="mr-2 h-4 w-4" />
            Cadastrar Nova Conta
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Conta</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Saldo Inicial</TableHead>
            <TableHead className="text-right">Saldo Atual</TableHead>
            <TableHead className="text-center">Data Inicial</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contas.map((conta) => (
            <TableRow key={conta.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: conta.cor || '#3b82f6' }}
                  />
                  <span className="font-medium">{conta.nome}</span>
                </div>
                {conta.tipo !== 'caixa' && (
                  <div className="text-xs text-gray-500 mt-1">
                    {conta.banco} - Ag: {conta.agencia} Conta: {conta.conta}-{conta.digito}
                  </div>
                )}
              </TableCell>
              <TableCell>
                {conta.tipo === 'corrente' && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <CreditCard className="h-3 w-3 mr-1" /> Corrente
                  </Badge>
                )}
                {conta.tipo === 'poupanca' && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Wallet className="h-3 w-3 mr-1" /> Poupança
                  </Badge>
                )}
                {conta.tipo === 'investimento' && (
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    <BarChart3 className="h-3 w-3 mr-1" /> Investimento
                  </Badge>
                )}
                {conta.tipo === 'caixa' && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    <Wallet className="h-3 w-3 mr-1" /> Caixa
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <Badge className={cn(
                  conta.status === 'ativa' && "bg-green-100 text-green-800 hover:bg-green-100",
                  conta.status === 'inativa' && "bg-gray-100 text-gray-800 hover:bg-gray-100",
                  conta.status === 'bloqueada' && "bg-red-100 text-red-800 hover:bg-red-100",
                )}>
                  {conta.status === 'ativa' && 'Ativa'}
                  {conta.status === 'inativa' && 'Inativa'}
                  {conta.status === 'bloqueada' && 'Bloqueada'}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatarMoeda(conta.saldo_inicial)}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatarMoeda(conta.saldo_atual)}
              </TableCell>
              <TableCell className="text-center text-sm">
                {format(new Date(conta.data_saldo_inicial), "dd/MM/yyyy", { locale: ptBR })}
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
                      <Link to={`/financeiro/contas-bancos/contas/${conta.id}`}>
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" /> Ver detalhes
                        </DropdownMenuItem>
                      </Link>
                      <Link to={`/financeiro/contas-bancos/contas/editar/${conta.id}`}>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" /> Editar
                        </DropdownMenuItem>
                      </Link>
                      <Link to={`/financeiro/contas-bancos/transferencias/cadastrar?origem=${conta.id}`}>
                        <DropdownMenuItem>
                          <ArrowLeftRight className="h-4 w-4 mr-2" /> Nova transferência
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
