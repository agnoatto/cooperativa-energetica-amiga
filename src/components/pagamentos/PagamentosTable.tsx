
import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
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
  const queryClient = useQueryClient();
  const [pagamentoParaDeletar, setPagamentoParaDeletar] = React.useState<PagamentoData | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

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

  const getPagamentosUltimos12Meses = async (pagamentoAtual: PagamentoData) => {
    const dataAtual = new Date(pagamentoAtual.ano, pagamentoAtual.mes - 1);
    const dataInicial = new Date(dataAtual);
    dataInicial.setMonth(dataInicial.getMonth() - 11); // 12 meses para trás

    console.log("[Histórico] Buscando pagamentos de", dataInicial.toISOString(), "até", dataAtual.toISOString());

    const { data: pagamentosHistorico, error } = await supabase
      .from('pagamentos_usina')
      .select(`
        id,
        geracao_kwh,
        tusd_fio_b,
        valor_tusd_fio_b,
        valor_concessionaria,
        valor_total,
        status,
        data_vencimento,
        data_pagamento,
        data_emissao,
        data_confirmacao,
        data_envio,
        mes,
        ano,
        arquivo_comprovante_nome,
        arquivo_comprovante_path,
        arquivo_comprovante_tipo,
        arquivo_comprovante_tamanho,
        observacao,
        observacao_pagamento,
        historico_status,
        send_method,
        empresa_id,
        usina:usinas(
          id,
          valor_kwh,
          unidade_usina:unidades_usina(
            numero_uc
          ),
          investidor:investidores(
            nome_investidor
          )
        )
      `)
      .eq('usina_id', pagamentoAtual.usina.id)
      .gte('ano', dataInicial.getFullYear())
      .lte('ano', dataAtual.getFullYear())
      .order('ano', { ascending: false })
      .order('mes', { ascending: false });

    if (error) {
      console.error("[Histórico] Erro ao buscar pagamentos:", error);
      return [pagamentoAtual];
    }

    console.log("[Histórico] Pagamentos encontrados:", pagamentosHistorico?.length || 0);
    return pagamentosHistorico as PagamentoData[];
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
                  pagamento={pagamento}
                  getPagamentosUltimos12Meses={getPagamentosUltimos12Meses}
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
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
