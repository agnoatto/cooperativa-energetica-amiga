
import React from "react";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatters";
import { PagamentoData } from "../types/pagamento";
import { PagamentoPdfButton } from "../PagamentoPdfButton";
import { BoletimMedicaoButton } from "../BoletimMedicaoButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, FileText, MoreVertical, Pencil, Trash2 } from "lucide-react";

interface PagamentoTableRowProps {
  pagamento: PagamentoData;
  onEdit: (pagamento: PagamentoData) => void;
  onDelete: (pagamento: PagamentoData) => void;
  onViewDetails: (pagamento: PagamentoData) => void;
  getPagamentosUltimos12Meses: (pagamento: PagamentoData) => Promise<PagamentoData[]>;
}

export function PagamentoTableRow({
  pagamento,
  onEdit,
  onDelete,
  onViewDetails,
  getPagamentosUltimos12Meses,
}: PagamentoTableRowProps) {
  const [showBoletimPreview, setShowBoletimPreview] = React.useState(false);
  
  const handleGeneratePdf = () => {
    const pdfButton = document.getElementById(`pagamento-pdf-${pagamento.id}`);
    if (pdfButton) {
      pdfButton.click();
    }
  };

  const handleGenerateBoletim = () => {
    const boletimButton = document.getElementById(`boletim-${pagamento.id}`);
    if (boletimButton) {
      boletimButton.click();
    }
  };

  return (
    <TableRow>
      <TableCell>{pagamento.usina?.unidade_usina?.numero_uc}</TableCell>
      <TableCell>{pagamento.usina?.investidor?.nome_investidor}</TableCell>
      <TableCell className="text-right">{pagamento.geracao_kwh}</TableCell>
      <TableCell className="text-right">
        {formatCurrency(pagamento.valor_concessionaria)}
      </TableCell>
      <TableCell className="text-right">
        {formatCurrency(pagamento.valor_total)}
      </TableCell>
      <TableCell className="text-right">{pagamento.status}</TableCell>
      <TableCell>
        {pagamento.arquivo_conta_energia_nome || "Não anexada"}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <PagamentoPdfButton
            id={`pagamento-pdf-${pagamento.id}`}
            pagamento={pagamento}
          />
          
          <BoletimMedicaoButton
            id={`boletim-${pagamento.id}`}
            pagamento={pagamento}
            getPagamentosUltimos12Meses={getPagamentosUltimos12Meses}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0"
              >
                <span className="sr-only">Abrir menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem onClick={() => onViewDetails(pagamento)}>
                <Eye className="mr-2 h-4 w-4" />
                Visualizar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(pagamento)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(pagamento)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleGeneratePdf}>
                <FileText className="mr-2 h-4 w-4" />
                Gerar PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleGenerateBoletim}>
                <FileText className="mr-2 h-4 w-4" />
                Boletim
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}
