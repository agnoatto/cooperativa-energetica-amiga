
import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PagamentoData } from "./types/pagamento";
import { toast } from "sonner";
import { PagamentosLoadingState } from "./table/PagamentosLoadingState";
import { PagamentosEmptyState } from "./table/PagamentosEmptyState";
import { DeletePagamentoDialog } from "./DeletePagamentoDialog";
import { PagamentoTableRow } from "./table/PagamentoTableRow";
import { usePagamentosHistorico } from "./hooks/usePagamentosHistorico";

interface PagamentosTableProps {
  pagamentos: PagamentoData[];
  isLoading: boolean;
  onEditPagamento: (pagamento: PagamentoData) => void;
}

export function PagamentosTable({
  pagamentos,
  isLoading,
  onEditPagamento,
}: PagamentosTableProps) {
  const queryClient = useQueryClient();
  const [pagamentoParaDeletar, setPagamentoParaDeletar] = React.useState<PagamentoData | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const { getPagamentosUltimos12Meses } = usePagamentosHistorico();

  const handleDelete = async () => {
    if (!pagamentoParaDeletar) return;
    
    setIsDeleting(true);
    console.log("[Deleção] Iniciando processo para pagamento:", pagamentoParaDeletar.id);

    try {
      const { error } = await supabase.rpc('deletar_pagamento', {
        pagamento_id: pagamentoParaDeletar.id
      });

      if (error) {
        console.error("[Deleção] Erro na transação:", error);
        throw new Error("Erro ao excluir o pagamento e seus lançamentos");
      }

      console.log("[Deleção] Pagamento e lançamentos excluídos com sucesso");
      toast.success("Pagamento excluído com sucesso!");
      setPagamentoParaDeletar(null);
      
      await queryClient.invalidateQueries({ queryKey: ["pagamentos"] });
    } catch (error) {
      console.error("[Deleção] Erro detalhado:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao excluir pagamento");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <PagamentosLoadingState />;
  }

  if (!pagamentos?.length) {
    return <PagamentosEmptyState />;
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>UC</TableHead>
            <TableHead>Investidor</TableHead>
            <TableHead className="text-right">Geração (kWh)</TableHead>
            <TableHead className="text-right">Valor Conc.</TableHead>
            <TableHead className="text-right">Valor Total</TableHead>
            <TableHead className="text-right">Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pagamentos.map((pagamento) => (
            <PagamentoTableRow
              key={pagamento.id}
              pagamento={pagamento}
              onEdit={onEditPagamento}
              onDelete={setPagamentoParaDeletar}
              getPagamentosUltimos12Meses={getPagamentosUltimos12Meses}
            />
          ))}
        </TableBody>
      </Table>

      <DeletePagamentoDialog
        pagamento={pagamentoParaDeletar}
        isDeleting={isDeleting}
        onDelete={handleDelete}
        onClose={() => setPagamentoParaDeletar(null)}
      />
    </div>
  );
}
