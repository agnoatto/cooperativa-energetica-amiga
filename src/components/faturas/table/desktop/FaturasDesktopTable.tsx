
/**
 * Componente de tabela desktop para faturas
 * 
 * Implementa uma tabela responsiva com scroll horizontal controlado
 * utilizando ScrollArea para garantir uma experiência profissional.
 */
import { Fatura, FaturaStatus } from "@/types/fatura";
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FaturaDesktopRow } from "./FaturaDesktopRow";
import { useMemo } from "react";
import { FaturasTableHeader } from "../FaturasTableHeader";

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
  const sortedFaturas = useMemo(() => {
    return [...faturas].sort((a, b) => {
      // Faturas não pagas primeiro
      if (a.status !== 'paga' && b.status === 'paga') return -1;
      if (a.status === 'paga' && b.status !== 'paga') return 1;
      
      // Depois por data de vencimento (mais próximas primeiro)
      return new Date(a.data_vencimento).getTime() - new Date(b.data_vencimento).getTime();
    });
  }, [faturas]);

  return (
    <div className="border rounded-md shadow-sm overflow-hidden">
      <ScrollArea className="h-[calc(100vh-360px)] w-full">
        <div className="relative w-full">
          <Table className="w-full min-w-[1200px] table-fixed">
            <TableHeader className="bg-gray-50 sticky top-0 z-10">
              <TableRow className="border-b border-gray-200">
                <TableHead className="w-[120px] py-3 px-4 text-sm font-medium text-gray-700">UC</TableHead>
                <TableHead className="w-[200px] py-3 px-4 text-sm font-medium text-gray-700">Cooperado</TableHead>
                <TableHead className="w-[120px] py-3 px-4 text-sm font-medium text-gray-700 text-right">Valor</TableHead>
                <TableHead className="w-[120px] py-3 px-4 text-sm font-medium text-gray-700 text-right">Vencimento</TableHead>
                <TableHead className="w-[120px] py-3 px-4 text-sm font-medium text-gray-700 text-right">Status</TableHead>
                <TableHead className="w-[150px] py-3 px-4 text-sm font-medium text-gray-700 text-center">Fatura Concessionária</TableHead>
                <TableHead className="w-[150px] py-3 px-4 text-sm font-medium text-gray-700 text-center">Próxima Leitura</TableHead>
                <TableHead className="w-[120px] py-3 px-4 text-sm font-medium text-gray-700 text-center sticky right-0 bg-gray-50 shadow-[-8px_0_16px_-6px_rgba(0,0,0,0.05)]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedFaturas.map((fatura) => (
                <FaturaDesktopRow
                  key={fatura.id}
                  fatura={fatura}
                  onViewDetails={onViewDetails}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onUpdateStatus={onUpdateStatus}
                  onShowPaymentConfirmation={onShowPaymentConfirmation}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
}
