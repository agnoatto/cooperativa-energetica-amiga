
import { format } from "date-fns";
import { Eye, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LancamentoFinanceiro } from "@/types/financeiro";
import { formatarMoeda } from "@/utils/formatters";
import { getStatusColor } from "../utils/status";

interface LancamentosTableProps {
  lancamentos?: LancamentoFinanceiro[];
  isLoading: boolean;
  tipo: 'receita' | 'despesa';
}

export function LancamentosTable({ lancamentos, isLoading, tipo }: LancamentosTableProps) {
  const getNomeEntidade = (lancamento: LancamentoFinanceiro) => {
    if (tipo === 'receita') {
      return lancamento.cooperado?.nome;
    }
    return lancamento.investidor?.nome_investidor;
  };

  const getLabelEntidade = () => {
    return tipo === 'receita' ? 'Cooperado' : 'Investidor';
  };

  return (
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead>{getLabelEntidade()}</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Carregando...
              </TableCell>
            </TableRow>
          ) : lancamentos?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Nenhum lançamento encontrado
              </TableCell>
            </TableRow>
          ) : (
            lancamentos?.map((lancamento) => (
              <TableRow key={lancamento.id}>
                <TableCell>{lancamento.descricao}</TableCell>
                <TableCell>{getNomeEntidade(lancamento)}</TableCell>
                <TableCell>
                  {format(new Date(lancamento.data_vencimento), "dd/MM/yyyy")}
                </TableCell>
                <TableCell>{formatarMoeda(lancamento.valor)}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(lancamento.status)}`}>
                    {lancamento.status.charAt(0).toUpperCase() + lancamento.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {(tipo === 'receita' ? lancamento.fatura : lancamento.pagamento_usina) && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 ml-2"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
