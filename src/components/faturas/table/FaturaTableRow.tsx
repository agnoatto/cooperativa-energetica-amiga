import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Fatura, FaturaStatus } from "@/types/fatura";
import { Edit, Eye, File, MoreVertical, Send, Trash2, CheckCircle2, Upload } from "lucide-react";
import { FaturaPdfButton } from "../FaturaPdfButton";
import { useState } from "react";
import { PaymentConfirmationModal } from "../PaymentConfirmationModal";
import { ConcessionariaInvoiceUpload } from "../upload/ConcessionariaInvoiceUpload";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";

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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

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

  const handlePaymentConfirm = async (paymentData: {
    id: string;
    data_pagamento: string;
    valor_adicional: number;
    observacao_pagamento: string | null;
  }) => {
    await onUpdateStatus(
      fatura,
      'paga',
      'Pagamento confirmado com' + (paymentData.valor_adicional > 0 ? ' valor adicional' : '')
    );
  };

  const handleFileUploadSuccess = async (filePath: string) => {
    const { error } = await supabase
      .from('faturas')
      .update({
        arquivo_concessionaria_path: filePath,
      })
      .eq('id', fatura.id);

    if (error) {
      console.error('Error updating fatura:', error);
      throw error;
    }
  };

  const downloadFile = async () => {
    if (!fatura.arquivo_concessionaria_path) return;

    try {
      const { data, error } = await supabase.storage
        .from('faturas-concessionaria')
        .download(fatura.arquivo_concessionaria_path);

      if (error) throw error;

      // Create a download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fatura.arquivo_concessionaria_nome || 'fatura-concessionaria.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const getActionsDropdownItems = () => {
    const items = [];

    items.push(
      <DropdownMenuItem key="view" onClick={() => onViewDetails(fatura)}>
        <Eye className="mr-2 h-4 w-4" />
        Visualizar Detalhes
      </DropdownMenuItem>
    );

    if (['gerada', 'pendente'].includes(fatura.status)) {
      items.push(
        <DropdownMenuItem key="edit" onClick={() => onEdit(fatura)}>
          <Edit className="mr-2 h-4 w-4" />
          Editar Fatura
        </DropdownMenuItem>
      );
    }

    if (fatura.status === 'pendente') {
      items.push(
        <DropdownMenuItem 
          key="send" 
          onClick={() => onUpdateStatus(fatura, 'enviada', 'Fatura enviada ao cliente')}
        >
          <Send className="mr-2 h-4 w-4" />
          Enviar Fatura
        </DropdownMenuItem>
      );
    }

    if (['enviada', 'atrasada'].includes(fatura.status)) {
      items.push(
        <DropdownMenuItem key="confirm" onClick={() => setShowPaymentModal(true)}>
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Confirmar Pagamento
        </DropdownMenuItem>
      );
    }

    if (fatura.status === 'paga') {
      items.push(
        <DropdownMenuItem 
          key="finish" 
          onClick={() => onUpdateStatus(fatura, 'finalizada', 'Fatura finalizada - pagamento processado')}
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Finalizar Fatura
        </DropdownMenuItem>
      );
    }

    if (fatura.status === 'gerada') {
      items.push(
        <DropdownMenuItem key="delete" onClick={() => onDelete(fatura)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir Fatura
        </DropdownMenuItem>
      );
    }

    return items;
  };

  return (
    <>
      <TableRow>
        <TableCell>{fatura.unidade_beneficiaria.cooperado.nome}</TableCell>
        <TableCell>{fatura.unidade_beneficiaria.cooperado.documento}</TableCell>
        <TableCell>
          {fatura.unidade_beneficiaria.numero_uc}
          {fatura.unidade_beneficiaria.apelido && (
            <span className="text-gray-500 text-sm ml-1">
              ({fatura.unidade_beneficiaria.apelido})
            </span>
          )}
        </TableCell>
        <TableCell>
          {format(new Date(fatura.data_vencimento), 'dd/MM/yyyy')}
        </TableCell>
        <TableCell>{fatura.consumo_kwh} kWh</TableCell>
        <TableCell>{formatCurrency(fatura.total_fatura)}</TableCell>
        <TableCell>{formatCurrency(fatura.fatura_concessionaria)}</TableCell>
        <TableCell>{fatura.unidade_beneficiaria.percentual_desconto}%</TableCell>
        <TableCell>{formatCurrency(fatura.valor_desconto)}</TableCell>
        <TableCell>
          {formatCurrency(fatura.valor_total)}
          {fatura.valor_adicional > 0 && (
            <span className="text-yellow-600 text-sm block">
              +{formatCurrency(fatura.valor_adicional)}
            </span>
          )}
        </TableCell>
        <TableCell>
          <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(fatura.status)}`}>
            {getStatusLabel(fatura.status)}
          </span>
          {fatura.status === 'paga' && fatura.data_pagamento && (
            <span className="text-gray-500 text-xs block mt-1">
              Pago em: {format(new Date(fatura.data_pagamento), 'dd/MM/yyyy')}
            </span>
          )}
        </TableCell>
        <TableCell>
          <FaturaPdfButton fatura={fatura} />
        </TableCell>
        <TableCell>
          <Button
            variant="outline"
            size="icon"
            disabled={!fatura.arquivo_concessionaria_path}
            title={fatura.arquivo_concessionaria_path ? "Visualizar Fatura da Concessionária" : "Fatura não disponível"}
          >
            <File className="h-4 w-4" />
          </Button>
        </TableCell>
        <TableCell>
          <Button
            variant="outline"
            size="icon"
            onClick={() => fatura.arquivo_concessionaria_path ? downloadFile() : setShowUploadModal(true)}
            title={fatura.arquivo_concessionaria_path ? "Baixar Fatura da Concessionária" : "Enviar Fatura da Concessionária"}
          >
            {fatura.arquivo_concessionaria_path ? (
              <File className="h-4 w-4" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
          </Button>
        </TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {getActionsDropdownItems()}
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      <PaymentConfirmationModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        fatura={fatura}
        onConfirm={handlePaymentConfirm}
      />

      <ConcessionariaInvoiceUpload
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        faturaId={fatura.id}
        onSuccess={handleFileUploadSuccess}
      />
    </>
  );
}
