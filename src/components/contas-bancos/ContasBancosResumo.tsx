
/**
 * Resumo de Contas Bancárias
 * 
 * Componente que exibe uma tabela resumida com as contas bancárias
 * e seus respectivos saldos, status e ações.
 */
import { ContaBancaria } from "@/types/contas-bancos";
import { Skeleton } from "@/components/ui/skeleton";
import { formatarMoeda } from "@/utils/formatters";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, ArrowLeftRight, CreditCard, Wallet, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ContasBancosResumoProps {
  contas: ContaBancaria[];
  isLoading: boolean;
}

// Dados simulados (serão substituídos por dados reais)
const contasSimuladas: ContaBancaria[] = [
  {
    id: "1",
    nome: "Conta Principal",
    tipo: "corrente",
    status: "ativa",
    banco: "Banco do Brasil",
    agencia: "1234",
    conta: "56789",
    digito: "0",
    saldo_atual: 15420.50,
    saldo_inicial: 10000.00,
    data_saldo_inicial: "2024-01-01",
    cor: "#3b82f6",
    empresa_id: "1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-04-01T00:00:00Z",
  },
  {
    id: "2",
    nome: "Poupança",
    tipo: "poupanca",
    status: "ativa",
    banco: "Caixa Econômica",
    agencia: "4321",
    conta: "98765",
    digito: "1",
    saldo_atual: 25000.00,
    saldo_inicial: 20000.00,
    data_saldo_inicial: "2024-01-01",
    cor: "#10b981",
    empresa_id: "1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-04-01T00:00:00Z",
  },
  {
    id: "3",
    nome: "Caixa Interno",
    tipo: "caixa",
    status: "ativa",
    saldo_atual: 2500.00,
    saldo_inicial: 1000.00,
    data_saldo_inicial: "2024-01-01",
    cor: "#f59e0b",
    empresa_id: "1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-04-01T00:00:00Z",
  },
];

export function ContasBancosResumo({ contas, isLoading }: ContasBancosResumoProps) {
  // Usar dados simulados enquanto não temos dados reais
  const dadosContas = contas.length > 0 ? contas : contasSimuladas;
  
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (dadosContas.length === 0) {
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
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Conta</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Saldo Atual</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dadosContas.map((conta) => (
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
                {formatarMoeda(conta.saldo_atual)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link to={`/financeiro/contas-bancos/contas/${conta.id}`}>
                    <Button variant="ghost" size="icon" title="Ver detalhes">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to={`/financeiro/contas-bancos/transferencias/cadastrar?origem=${conta.id}`}>
                    <Button variant="ghost" size="icon" title="Nova transferência">
                      <ArrowLeftRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
