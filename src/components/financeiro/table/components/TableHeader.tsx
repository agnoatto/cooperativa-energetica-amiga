
/**
 * Componente de cabeçalho da tabela de lançamentos
 * 
 * Renderiza o cabeçalho da tabela com os nomes das colunas,
 * adaptando o rótulo do contato conforme o tipo de lançamento.
 */
import { TableHead, TableHeader as UITableHeader, TableRow } from "@/components/ui/table";

interface TableHeaderProps {
  tipo: "receita" | "despesa";
}

export function LancamentosTableHeader({ tipo }: TableHeaderProps) {
  // Determinar o rótulo do contato (cooperado ou investidor)
  const getLabelContato = () => {
    return tipo === 'receita' ? 'Cooperado' : 'Investidor';
  };

  return (
    <UITableHeader>
      <TableRow>
        <TableHead>Descrição</TableHead>
        <TableHead>{getLabelContato()}</TableHead>
        <TableHead>Vencimento</TableHead>
        <TableHead>Valor</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="text-right">Ações</TableHead>
      </TableRow>
    </UITableHeader>
  );
}
