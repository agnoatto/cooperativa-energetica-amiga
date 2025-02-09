
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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cooperado</TableHead>
              <TableHead>UC</TableHead>
              <TableHead>Consumo (kWh)</TableHead>
              <TableHead>Valor Original</TableHead>
              <TableHead>Conta de Energia</TableHead>
              <TableHead>Desconto (%)</TableHead>
              <TableHead>Valor Desconto</TableHead>
              <TableHead>Valor da Assinatura</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : faturas && faturas.length > 0 ? (
              faturas.map((fatura) => (
                <TableRow key={fatura.id}>
                  <TableCell>{fatura.unidade_beneficiaria.cooperado.nome}</TableCell>
                  <TableCell>
                    {fatura.unidade_beneficiaria.numero_uc}
                    {fatura.unidade_beneficiaria.apelido && (
                      <span className="text-gray-500 text-sm ml-1">
                        ({fatura.unidade_beneficiaria.apelido})
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{fatura.consumo_kwh} kWh</TableCell>
                  <TableCell>{formatCurrency(fatura.total_fatura)}</TableCell>
                  <TableCell>{formatCurrency(fatura.fatura_concessionaria)}</TableCell>
                  <TableCell>{fatura.unidade_beneficiaria.percentual_desconto}%</TableCell>
                  <TableCell>{formatCurrency(fatura.valor_desconto)}</TableCell>
                  <TableCell>{formatCurrency(fatura.valor_total)}</TableCell>
                  <TableCell>
                    <FaturaStatusBadge status={fatura.status} />
                  </TableCell>
                  <TableCell className="text-right">
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
                <TableCell colSpan={10} className="text-center text-gray-500">
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
