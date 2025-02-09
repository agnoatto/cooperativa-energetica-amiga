
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
import { Eye } from "lucide-react";
import { Button } from "../ui/button";

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
      <div className="overflow-x-auto border border-gray-200 rounded-md">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 bg-gray-50">
                <TableHead className="h-9 px-2 text-xs font-medium text-gray-600">Cooperado</TableHead>
                <TableHead className="h-9 px-2 text-xs font-medium text-gray-600">Valor Total</TableHead>
                <TableHead className="h-9 px-2 text-xs font-medium text-gray-600">Data Vencimento</TableHead>
                <TableHead className="h-9 px-2 text-xs font-medium text-gray-600">Status</TableHead>
                <TableHead className="h-9 px-2 text-xs font-medium text-gray-600 text-center">Visualizar</TableHead>
                <TableHead className="h-9 px-2 text-xs font-medium text-gray-600 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : faturas && faturas.length > 0 ? (
                faturas.map((fatura) => (
                  <TableRow 
                    key={fatura.id}
                    className="border-b border-gray-100 hover:bg-gray-50/50"
                  >
                    <TableCell className="py-2 px-2">
                      <div>
                        <span className="font-medium text-sm text-gray-900">
                          {fatura.unidade_beneficiaria.cooperado.nome}
                        </span>
                        <div className="text-xs text-gray-500">
                          UC: {fatura.unidade_beneficiaria.numero_uc}
                          {fatura.unidade_beneficiaria.apelido && ` - ${fatura.unidade_beneficiaria.apelido}`}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 px-2 text-sm whitespace-nowrap">
                      {formatCurrency(fatura.valor_total)}
                    </TableCell>
                    <TableCell className="py-2 px-2 text-sm whitespace-nowrap">
                      {format(new Date(fatura.data_vencimento), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell className="py-2 px-2">
                      <FaturaStatusBadge status={fatura.status} />
                    </TableCell>
                    <TableCell className="py-2 px-2 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFatura(fatura)}
                        className="hover:bg-gray-100"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="py-2 px-2 text-right">
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
                  <TableCell colSpan={6} className="text-center text-sm text-gray-500">
                    Nenhuma fatura encontrada para este mês
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
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
