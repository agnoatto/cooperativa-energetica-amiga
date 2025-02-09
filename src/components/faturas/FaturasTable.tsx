
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2, Send, CheckCircle2, XCircle } from "lucide-react";
import { FaturaPdfButton } from "./FaturaPdfButton";
import { FaturaDetailsDialog } from "./FaturaDetailsDialog";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { useState } from "react";

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

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const getStatusColor = (status: FaturaStatus) => {
    const colors = {
      gerada: 'bg-gray-100 text-gray-800',
      pendente: 'bg-yellow-100 text-yellow-800',
      enviada: 'bg-blue-100 text-blue-800',
      atrasada: 'bg-red-100 text-red-800',
      paga: 'bg-green-100 text-green-800',
      finalizada: 'bg-purple-100 text-purple-800'
    };
    return colors[status];
  };

  const getStatusLabel = (status: FaturaStatus) => {
    const labels = {
      gerada: 'Gerada',
      pendente: 'Pendente',
      enviada: 'Enviada',
      atrasada: 'Atrasada',
      paga: 'Paga',
      finalizada: 'Finalizada'
    };
    return labels[status];
  };

  const getAvailableActions = (fatura: Fatura) => {
    const actions = [];

    // Botão de visualizar sempre disponível
    actions.push(
      <Button
        key="view"
        variant="outline"
        size="icon"
        onClick={() => setSelectedFatura(fatura)}
        title="Visualizar Detalhes"
      >
        <Eye className="h-4 w-4" />
      </Button>
    );

    // Botão de editar disponível para faturas geradas e pendentes
    if (['gerada', 'pendente'].includes(fatura.status)) {
      actions.push(
        <Button
          key="edit"
          variant="outline"
          size="icon"
          onClick={() => onEditFatura(fatura)}
          title="Editar Fatura"
        >
          <Edit className="h-4 w-4" />
        </Button>
      );
    }

    // Botão de enviar disponível para faturas pendentes
    if (fatura.status === 'pendente') {
      actions.push(
        <Button
          key="send"
          variant="outline"
          size="icon"
          onClick={() => onUpdateStatus(fatura, 'enviada', 'Fatura enviada ao cliente')}
          title="Enviar Fatura"
        >
          <Send className="h-4 w-4" />
        </Button>
      );
    }

    // Botão de confirmar pagamento para faturas enviadas ou atrasadas
    if (['enviada', 'atrasada'].includes(fatura.status)) {
      actions.push(
        <Button
          key="confirm"
          variant="outline"
          size="icon"
          onClick={() => onUpdateStatus(fatura, 'paga', 'Pagamento confirmado pelo cliente')}
          title="Confirmar Pagamento"
        >
          <CheckCircle2 className="h-4 w-4" />
        </Button>
      );
    }

    // Botão de finalizar para faturas pagas
    if (fatura.status === 'paga') {
      actions.push(
        <Button
          key="finish"
          variant="outline"
          size="icon"
          onClick={() => onUpdateStatus(fatura, 'finalizada', 'Fatura finalizada - pagamento processado')}
          title="Finalizar Fatura"
        >
          <CheckCircle2 className="h-4 w-4" />
        </Button>
      );
    }

    // Botão de excluir disponível apenas para faturas geradas
    if (fatura.status === 'gerada') {
      actions.push(
        <Button
          key="delete"
          variant="outline"
          size="icon"
          onClick={() => onDeleteFatura(fatura.id)}
          title="Excluir Fatura"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      );
    }

    // Botão de PDF sempre disponível
    actions.push(
      <FaturaPdfButton key="pdf" fatura={fatura} />
    );

    return actions;
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
                    <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(fatura.status)}`}>
                      {getStatusLabel(fatura.status)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {getAvailableActions(fatura)}
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
    </>
  );
}
