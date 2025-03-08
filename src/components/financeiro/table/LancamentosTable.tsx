
import { format } from "date-fns";
import { Eye, FileText } from "lucide-react";
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
import { TableActionMenu, TableAction } from "@/components/ui/table-action-menu";

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

  const getActions = (lancamento: LancamentoFinanceiro): TableAction[] => {
    const actions: TableAction[] = [
      {
        label: "Visualizar",
        icon: Eye,
        onClick: () => console.log("Visualizar lançamento", lancamento.id)
      }
    ];
    
    // Adicionar ação de visualizar PDF se tiver fatura ou pagamento associado
    if ((tipo === 'receita' ? lancamento.fatura : lancamento.pagamento_usina)) {
      actions.push({
        label: "Ver documento",
        icon: FileText,
        onClick: () => console.log("Ver documento", lancamento.id)
      });
    }
    
    return actions;
  };

  return (
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="h-9">
            <TableHead className="py-2">Descrição</TableHead>
            <TableHead className="py-2">{getLabelEntidade()}</TableHead>
            <TableHead className="py-2">Vencimento</TableHead>
            <TableHead className="py-2">Valor</TableHead>
            <TableHead className="py-2">Status</TableHead>
            <TableHead className="text-right py-2 w-[60px]">Ações</TableHead>
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
              <TableRow key={lancamento.id} className="h-9">
                <TableCell className="py-1.5">{lancamento.descricao}</TableCell>
                <TableCell className="py-1.5">{getNomeEntidade(lancamento)}</TableCell>
                <TableCell className="py-1.5">
                  {format(new Date(lancamento.data_vencimento), "dd/MM/yyyy")}
                </TableCell>
                <TableCell className="py-1.5">{formatarMoeda(lancamento.valor)}</TableCell>
                <TableCell className="py-1.5">
                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${getStatusColor(lancamento.status)}`}>
                    {lancamento.status.charAt(0).toUpperCase() + lancamento.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="py-1.5 text-right">
                  <TableActionMenu actions={getActions(lancamento)} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
