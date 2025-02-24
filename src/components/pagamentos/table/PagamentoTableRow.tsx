
import { format } from "date-fns";
import { FileDown, MoreVertical, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { PagamentoData } from "../types/pagamento";
import { formatarMoeda } from "@/utils/formatters";
import { useCallback } from "react";
import { toast } from "sonner";
import { usePagamentoStatus } from "../hooks/usePagamentoStatus";

interface PagamentoTableRowProps {
  pagamento: PagamentoData;
  onEdit: (pagamento: PagamentoData) => void;
  onDelete: (pagamento: PagamentoData) => void;
  onViewDetails: (pagamento: PagamentoData) => void;
}

export function PagamentoTableRow({
  pagamento,
  onEdit,
  onDelete,
  onViewDetails,
}: PagamentoTableRowProps) {
  const { StatusBadge, handleSendPagamento } = usePagamentoStatus();
  
  const valorBruto = pagamento.geracao_kwh * (pagamento.usina?.valor_kwh || 0);
  const valorEfetivo = valorBruto - pagamento.valor_tusd_fio_b - pagamento.valor_concessionaria;

  const handleSend = useCallback(async (method: 'email' | 'whatsapp') => {
    try {
      await handleSendPagamento(pagamento, method);
      toast.success(`Boletim enviado com sucesso por ${method === 'email' ? 'e-mail' : 'WhatsApp'}`);
    } catch (error) {
      console.error('Erro ao enviar boletim:', error);
      toast.error('Erro ao enviar boletim');
    }
  }, [pagamento, handleSendPagamento]);

  return (
    <TableRow>
      <TableCell>{pagamento.usina?.unidade_usina?.numero_uc}</TableCell>
      <TableCell>{pagamento.usina?.investidor?.nome_investidor}</TableCell>
      <TableCell className="text-right">{pagamento.geracao_kwh}</TableCell>
      <TableCell className="text-right">
        {formatarMoeda(pagamento.valor_concessionaria)}
      </TableCell>
      <TableCell className="text-right">{formatarMoeda(valorEfetivo)}</TableCell>
      <TableCell className="text-right">
        <StatusBadge status={pagamento.status} />
      </TableCell>
      <TableCell className="text-center">
        {pagamento.arquivo_conta_energia_path && (
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <FileDown className="h-4 w-4" />
          </Button>
        )}
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewDetails(pagamento)}>
              Ver detalhes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(pagamento)}>
              Editar
            </DropdownMenuItem>
            
            {pagamento.status === 'pendente' && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex gap-2">
                  <Send className="h-4 w-4" />
                  <span>Enviar por</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleSend('email')}>
                  E-mail
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleSend('whatsapp')}>
                  WhatsApp
                </DropdownMenuItem>
              </>
            )}
            
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(pagamento)}
            >
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
