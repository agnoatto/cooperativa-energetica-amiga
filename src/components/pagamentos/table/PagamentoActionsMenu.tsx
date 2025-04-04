
/**
 * Menu de ações para pagamentos
 * 
 * Este componente exibe as opções de ações para cada pagamento usando Popover,
 * incluindo visualização de detalhes, boletim de medição, envio e edição.
 */
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  Edit, 
  FileText, 
  MoreHorizontal, 
  Trash2, 
  Download, 
  Send 
} from "lucide-react";
import { PagamentoData } from "../types/pagamento";
import { ActionMenuItem } from "@/components/faturas/table/components/ActionMenuItem";
import { toast } from "sonner";

interface PagamentoActionsMenuProps {
  pagamento: PagamentoData;
  onViewDetails: (pagamento: PagamentoData) => void;
  onEdit: (pagamento: PagamentoData) => void;
  onDelete: (pagamento: PagamentoData) => void;
  onViewFile?: () => void;
  onDownloadFile?: () => void;
  onSendPagamento?: () => void;
  onViewBoletim?: () => void;
  onDownloadBoletim?: () => void;
  isLoadingFile?: boolean;
  isUpdating?: boolean;
}

export function PagamentoActionsMenu({
  pagamento,
  onViewDetails,
  onEdit,
  onDelete,
  onViewFile,
  onDownloadFile,
  onSendPagamento,
  onViewBoletim,
  onDownloadBoletim,
  isLoadingFile = false,
  isUpdating = false
}: PagamentoActionsMenuProps) {
  const [open, setOpen] = useState(false);
  
  const hasFile = !!pagamento.arquivo_conta_energia_path;
  const isPendente = pagamento.status === 'pendente';

  const handleCloseMenu = () => setOpen(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" alignOffset={5} className="w-52 p-1">
        <div className="flex flex-col gap-0.5">
          <ActionMenuItem
            icon={<Eye className="h-4 w-4" />}
            label="Visualizar Detalhes"
            onClick={() => {
              onViewDetails(pagamento);
              handleCloseMenu();
            }}
          />
          
          {onViewBoletim && (
            <ActionMenuItem
              icon={<FileText className="h-4 w-4" />}
              label="Ver Boletim de Medição"
              onClick={() => {
                onViewBoletim();
                handleCloseMenu();
              }}
            />
          )}
          
          {onDownloadBoletim && (
            <ActionMenuItem
              icon={<Download className="h-4 w-4" />}
              label="Baixar Boletim de Medição"
              onClick={() => {
                onDownloadBoletim();
                handleCloseMenu();
              }}
            />
          )}
          
          {isPendente && onSendPagamento && (
            <ActionMenuItem
              icon={<Send className="h-4 w-4" />}
              label="Enviar Pagamento"
              onClick={() => {
                onSendPagamento();
                handleCloseMenu();
              }}
              disabled={isUpdating}
            />
          )}
          
          <ActionMenuItem
            icon={<Edit className="h-4 w-4" />}
            label="Editar"
            onClick={() => {
              onEdit(pagamento);
              handleCloseMenu();
            }}
          />
          
          {hasFile && onViewFile && (
            <ActionMenuItem
              icon={<FileText className="h-4 w-4" />}
              label="Ver Conta de Energia"
              onClick={() => {
                onViewFile();
                handleCloseMenu();
              }}
              disabled={isLoadingFile}
            />
          )}

          {hasFile && onDownloadFile && (
            <ActionMenuItem
              icon={<Download className="h-4 w-4" />}
              label="Baixar Conta de Energia"
              onClick={() => {
                onDownloadFile();
                handleCloseMenu();
              }}
              disabled={isLoadingFile}
            />
          )}
          
          <ActionMenuItem
            icon={<Trash2 className="h-4 w-4" />}
            label="Excluir"
            onClick={() => {
              onDelete(pagamento);
              handleCloseMenu();
            }}
            variant="destructive"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
