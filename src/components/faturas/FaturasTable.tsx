
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { useState } from "react";
import { FaturaStatusBadge } from "./FaturaStatusBadge";
import { FaturaActions } from "./FaturaActions";
import { FaturaDetailsDialog } from "./FaturaDetailsDialog";
import { SendFaturaDialog } from "./SendFaturaDialog";
import { format } from "date-fns";

interface FaturasTableProps {
  faturas: Fatura[] | undefined;
  isLoading: boolean;
  onEditFatura: (fatura: Fatura) => void;
  onDeleteFatura: (id: string) => Promise<void>;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
}

export function FaturasTable({ 
  faturas, 
  isLoading, 
  onEditFatura, 
  onDeleteFatura,
  onUpdateStatus 
}: FaturasTableProps) {
  const [selectedFatura, setSelectedFatura] = useState<Fatura | null>(null);
  const [sendFatura, setSendFatura] = useState<Fatura | null>(null);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const handleSendFatura = async (fatura: Fatura, method: "email" | "whatsapp") => {
    await onUpdateStatus(fatura, 'enviada', `Fatura enviada por ${method}`);
  };

  return (
    <>
      <div className="rounded-md border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-medium">Cooperado</TableHead>
              <TableHead className="text-xs font-medium">Valor Total</TableHead>
              <TableHead className="text-xs font-medium">Data Vencimento</TableHead>
              <TableHead className="text-xs font-medium">Status</TableHead>
              <TableHead className="text-xs font-medium text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : faturas && faturas.length > 0 ? (
              faturas.map((fatura) => (
                <TableRow 
                  key={fatura.id}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedFatura(fatura)}
                >
                  <TableCell className="py-2">
                    <div>
                      <span className="font-medium text-sm">
                        {fatura.unidade_beneficiaria.cooperado.nome}
                      </span>
                      <div className="text-xs text-gray-500">
                        UC: {fatura.unidade_beneficiaria.numero_uc}
                        {fatura.unidade_beneficiaria.apelido && ` - ${fatura.unidade_beneficiaria.apelido}`}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-2 text-sm">
                    {formatCurrency(fatura.valor_total)}
                  </TableCell>
                  <TableCell className="py-2 text-sm">
                    {format(new Date(fatura.data_vencimento), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className="py-2">
                    <FaturaStatusBadge status={fatura.status} />
                  </TableCell>
                  <TableCell className="py-2 text-right" onClick={(e) => e.stopPropagation()}>
                    <FaturaActions
                      fatura={fatura}
                      onView={setSelectedFatura}
                      onEdit={onEditFatura}
                      onSend={setSendFatura}
                      onDelete={onDeleteFatura}
                      onUpdateStatus={onUpdateStatus}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-sm text-gray-500">
                  Nenhuma fatura encontrada para este mês
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedFatura && (
        <FaturaDetailsDialog
          fatura={selectedFatura}
          isOpen={!!selectedFatura}
          onClose={() => setSelectedFatura(null)}
        />
      )}

      {sendFatura && (
        <SendFaturaDialog
          fatura={sendFatura}
          isOpen={!!sendFatura}
          onClose={() => setSendFatura(null)}
          onSend={(method) => handleSendFatura(sendFatura, method)}
        />
      )}
    </>
  );
}
