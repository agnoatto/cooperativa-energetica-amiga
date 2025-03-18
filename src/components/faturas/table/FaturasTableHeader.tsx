
import { TableHeader, TableRow, TableHead } from "@/components/ui/table"

/**
 * Cabeçalho da tabela de faturas
 * 
 * Este componente define as colunas da tabela de faturas, incluindo a coluna
 * que mostra a próxima data de leitura programada vinda do mês anterior.
 */
export function FaturasTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[100px]">UC</TableHead>
        <TableHead>Cooperado</TableHead>
        <TableHead className="text-right">Consumo</TableHead>
        <TableHead className="text-right">Valor</TableHead>
        <TableHead className="text-right">Vencimento</TableHead>
        <TableHead className="text-right">Status</TableHead>
        <TableHead className="text-center">Arquivo</TableHead>
        <TableHead className="text-center">Próx. Leitura</TableHead>
        <TableHead>Ações</TableHead>
        <TableHead className="w-[20px]"></TableHead>
      </TableRow>
    </TableHeader>
  );
}
