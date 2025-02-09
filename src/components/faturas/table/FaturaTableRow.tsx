
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { Edit, Eye, Trash2, Send, CheckCircle2 } from "lucide-react";
import { FaturaPdfButton } from "../FaturaPdfButton";

interface FaturaTableRowProps {
  fatura: Fatura;
  onViewDetails: (fatura: Fatura) => void;
  onEdit: (fatura: Fatura) => void;
  onDelete: (fatura: Fatura) => void;
  onUpdateStatus: (fatura: Fatura, newStatus: FaturaStatus, observacao?: string) => Promise<void>;
}

export function FaturaTableRow({
  fatura,
  onViewDetails,
  onEdit,
  onDelete,
  onUpdateStatus,
}: FaturaTableRowProps) {
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

  const getAvailableActions = () => {
    const actions = [];

    actions.push(
      <Button
        key="view"
        variant="outline"
        size="icon"
        onClick={() => onViewDetails(fatura)}
        title="Visualizar Detalhes"
      >
        <Eye className="h-4 w-4" />
      </Button>
    );

    if (['gerada', 'pendente'].includes(fatura.status)) {
      actions.push(
        <Button
          key="edit"
          variant="outline"
          size="icon"
          onClick={() => onEdit(fatura)}
          title="Editar Fatura"
        >
          <Edit className="h-4 w-4" />
        </Button>
      );
    }

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

    if (fatura.status === 'gerada') {
      actions.push(
        <Button
          key="delete"
          variant="outline"
          size="icon"
          onClick={() => onDelete(fatura)}
          title="Excluir Fatura"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      );
    }

    actions.push(
      <FaturaPdfButton key="pdf" fatura={fatura} />
    );

    return actions;
  };

  return (
    <TableRow>
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
        {getAvailableActions()}
      </TableCell>
    </TableRow>
  );
}
