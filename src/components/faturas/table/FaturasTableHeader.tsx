
/**
 * Cabeçalho da tabela de faturas
 * 
 * Este componente define as colunas da tabela de faturas, incluindo a coluna
 * que mostra a próxima data de leitura programada vinda do mês anterior.
 */
import { TableHeader, TableRow, TableHead } from "@/components/ui/table"

export function FaturasTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[100px]">UC</TableHead>
        <TableHead className="w-[180px]">Cooperado</TableHead>
        <TableHead className="text-right w-[100px]">Consumo</TableHead>
        <TableHead className="text-right w-[100px]">Valor</TableHead>
        <TableHead className="text-right w-[120px]">Vencimento</TableHead>
        <TableHead className="text-right w-[100px]">Status</TableHead>
        <TableHead className="text-center w-[150px]">Fatura Concessionária</TableHead>
        <TableHead className="text-center w-[150px]">Próx. Leitura</TableHead>
        <TableHead className="w-[100px] text-center sticky right-0 bg-gray-50 shadow-[-8px_0_16px_-6px_rgba(0,0,0,0.05)]">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
}
