
/**
 * Cards de Contas Bancárias para visualização mobile
 * 
 * Exibe as contas bancárias em formato de cartões, otimizado para
 * dispositivos móveis. Mostra informações como saldo, banco, tipo
 * e status da conta.
 */
import { ContaBancaria } from "@/types/contas-bancos";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { formatarMoeda } from "@/utils/formatters";
import { cn } from "@/lib/utils";
import { 
  CreditCard, 
  Wallet, 
  BarChart3, 
  ArrowLeftRight,
  Eye,
  Edit
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ContasBancariasCardsProps {
  contas: ContaBancaria[];
  isLoading: boolean;
}

export function ContasBancariasCards({ contas, isLoading }: ContasBancariasCardsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 mt-2">
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-36 w-full" />
        <Skeleton className="h-36 w-full" />
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
    <div className="space-y-4">
      {contas.map((conta) => (
        <Card key={conta.id} className={cn(
          "overflow-hidden",
          conta.status === 'inativa' && "opacity-70",
          conta.status === 'bloqueada' && "opacity-70"
        )}>
          <div 
            className="h-2" 
            style={{ backgroundColor: conta.cor || '#3b82f6' }}
          />
          <CardContent className="pt-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold">{conta.nome}</h3>
                  <Badge className={cn(
                    "ml-2",
                    conta.status === 'ativa' && "bg-green-100 text-green-800 hover:bg-green-100",
                    conta.status === 'inativa' && "bg-gray-100 text-gray-800 hover:bg-gray-100",
                    conta.status === 'bloqueada' && "bg-red-100 text-red-800 hover:bg-red-100",
                  )}>
                    {conta.status === 'ativa' && 'Ativa'}
                    {conta.status === 'inativa' && 'Inativa'}
                    {conta.status === 'bloqueada' && 'Bloqueada'}
                  </Badge>
                </div>
                
                {conta.tipo !== 'caixa' && (
                  <p className="text-sm text-gray-500 mt-1">
                    {conta.banco} - Ag: {conta.agencia} Conta: {conta.conta}-{conta.digito}
                  </p>
                )}

                <div className="flex items-center mt-2">
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
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-500">Saldo Atual</p>
                <p className="text-xl font-bold">{formatarMoeda(conta.saldo_atual)}</p>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between bg-gray-50 py-2">
            <Link to={`/financeiro/contas-bancos/contas/${conta.id}`}>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4 mr-2" /> Detalhes
              </Button>
            </Link>
            
            <Link to={`/financeiro/contas-bancos/contas/editar/${conta.id}`}>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4 mr-2" /> Editar
              </Button>
            </Link>
            
            <Link to={`/financeiro/contas-bancos/transferencias/cadastrar?origem=${conta.id}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeftRight className="h-4 w-4 mr-2" /> Transferir
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
