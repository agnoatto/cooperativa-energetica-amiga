
import React, { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, FileText } from "lucide-react";
import { PagamentoData } from "../types/pagamento";
import { formatCurrency } from "@/utils/formatters";
import { BoletimMedicaoButton } from "../BoletimMedicaoButton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const [isLoadingFile, setIsLoadingFile] = useState(false);

  const handleViewFile = async () => {
    if (!pagamento.arquivo_conta_energia_path) return;
    
    setIsLoadingFile(true);
    try {
      const { data, error } = await supabase.storage
        .from('contas-energia')
        .download(pagamento.arquivo_conta_energia_path);

      if (error) throw error;

      // Criar URL do arquivo para visualização
      const url = URL.createObjectURL(data);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error);
      toast.error('Erro ao carregar o arquivo');
    } finally {
      setIsLoadingFile(false);
    }
  };

  return (
    <TableRow>
      <TableCell>{pagamento.usina.unidade_usina.numero_uc}</TableCell>
      <TableCell>{pagamento.usina.investidor.nome_investidor}</TableCell>
      <TableCell className="text-right">
        {pagamento.geracao_kwh.toLocaleString('pt-BR')}
      </TableCell>
      <TableCell className="text-right">
        {formatCurrency(pagamento.valor_concessionaria)}
      </TableCell>
      <TableCell className="text-right">
        {formatCurrency(pagamento.valor_total)}
      </TableCell>
      <TableCell className="text-right">{pagamento.status}</TableCell>
      <TableCell>
        {pagamento.arquivo_conta_energia_path ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleViewFile}
            disabled={isLoadingFile}
            title="Visualizar conta de energia"
          >
            <FileText className="h-4 w-4 text-blue-500" />
          </Button>
        ) : (
          <div className="w-9 h-9 flex items-center justify-center">
            <FileText className="h-4 w-4 text-gray-300" />
          </div>
        )}
      </TableCell>
      <TableCell className="text-right space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onViewDetails(pagamento)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onEdit(pagamento)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onDelete(pagamento)}
          className="hover:bg-destructive hover:text-destructive-foreground"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <BoletimMedicaoButton 
          pagamento={pagamento}
          getPagamentosUltimos12Meses={getPagamentosUltimos12Meses}
        />
      </TableCell>
    </TableRow>
  );
}
