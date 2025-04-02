
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
          <Table className="w-full min-w-[1200px]">
            <FaturasTableHeader />
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
