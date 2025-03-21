
/**
 * Tabela de faturas para desktop
 * 
 * Este componente exibe as faturas em formato de tabela otimizado
 * para visualização em dispositivos desktop. Inclui informações
 * completas de cooperados e unidades beneficiárias.
 */
import { Fatura, FaturaStatus } from "@/types/fatura";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaturaDesktopRow } from "./FaturaDesktopRow";

interface FaturasDesktopTableProps {
  faturas: Fatura[];
  onViewDetails: (fatura: Fatura) => void;
  onEdit: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
  onShowPaymentConfirmation: (fatura: Fatura) => void;
}

export function FaturasDesktopTable({
  faturas,
  onViewDetails,
  onEdit,
  onDelete,
  onUpdateStatus,
  onShowPaymentConfirmation
}: FaturasDesktopTableProps) {
  // Função para visualizar PDF da fatura
  const handleViewPdf = (fatura: Fatura) => {
    // Verificamos se existe um arquivo de fatura
    if (!fatura.arquivo_concessionaria_path) {
      return;
    }
    
    // Esta função apenas passa o evento para o componente que exibe o PDF
    // A lógica de exibição está implementada no FaturaDesktopRow
  };

  return (
    <div className="rounded-md border border-gray-200 overflow-hidden">
      <Table className="w-full [&_th]:bg-gray-50 [&_th]:font-medium [&_th]:text-gray-700 [&_th]:h-9 [&_tr]:border-b [&_tr]:border-gray-200">
        <TableHeader className="[&_tr]:border-b [&_tr]:border-gray-200">
          <TableRow className="h-9">
            <TableHead className="py-1.5 px-3 text-sm">UC</TableHead>
            <TableHead className="py-1.5 px-3 text-sm">Cooperado</TableHead>
            <TableHead className="py-1.5 px-3 text-sm text-right">Consumo</TableHead>
            <TableHead className="py-1.5 px-3 text-sm text-right">Valor</TableHead>
            <TableHead className="py-1.5 px-3 text-sm text-right">Vencimento</TableHead>
            <TableHead className="py-1.5 px-3 text-sm text-right">Status</TableHead>
            <TableHead className="py-1.5 px-3 text-sm text-center">Fatura Concessionária</TableHead>
            <TableHead className="py-1.5 px-3 text-sm text-center">Próxima Leitura</TableHead>
            <TableHead className="py-1.5 px-3 text-sm text-center">Ações</TableHead>
            <TableHead className="py-1.5 px-3 text-sm w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {faturas.map((fatura) => (
            <FaturaDesktopRow
              key={fatura.id}
              fatura={fatura}
              onViewDetails={onViewDetails}
              onEdit={onEdit}
              onDelete={onDelete}
              onUpdateStatus={onUpdateStatus}
              onViewPdf={handleViewPdf}
              onShowPaymentConfirmation={onShowPaymentConfirmation}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
