
import React from "react";
import { useQueryClient } from "@tanstack/react-query"; // Adicionado
import { supabase } from "@/integrations/supabase/client"; // Adicionado
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, FileText, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PagamentoData } from "./types/pagamento";
import { formatCurrency } from "@/utils/formatters";
import { BoletimMedicaoButton } from "./BoletimMedicaoButton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

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
  const queryClient = useQueryClient(); // Adicionado
  const [pagamentoParaDeletar, setPagamentoParaDeletar] = React.useState<PagamentoData | null>(null);

  const handleDelete = async () => {
    if (!pagamentoParaDeletar) return;

    try {
      const { error } = await supabase
        .from("pagamentos_usina")
        .delete()
        .eq("id", pagamentoParaDeletar.id);

      if (error) throw error;

      toast.success("Pagamento excluído com sucesso!");
      setPagamentoParaDeletar(null);
      
      // Atualizar a lista de pagamentos após deletar
      await queryClient.invalidateQueries({ queryKey: ["pagamentos"] });
    } catch (error) {
      console.error("Erro ao excluir pagamento:", error);
      toast.error("Erro ao excluir pagamento");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-sm text-gray-500">Carregando pagamentos...</p>
        </div>
      </div>
    );
  }

  if (!pagamentos?.length) {
    return (
      <div className="text-center p-4">
        <p className="text-sm text-gray-500">Nenhum pagamento encontrado.</p>
      </div>
    );
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
            <TableRow key={pagamento.id}>
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
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEditPagamento(pagamento)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPagamentoParaDeletar(pagamento)}
                  className="hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <BoletimMedicaoButton 
                  boletimData={{
                    usina: {
                      nome_investidor: pagamento.usina.investidor.nome_investidor,
                      numero_uc: pagamento.usina.unidade_usina.numero_uc,
                      valor_kwh: pagamento.usina.valor_kwh
                    },
                    pagamentos: [pagamento],
                    data_emissao: new Date(),
                    valor_receber: pagamento.valor_total
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog 
        open={!!pagamentoParaDeletar} 
        onOpenChange={() => setPagamentoParaDeletar(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Pagamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este pagamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
