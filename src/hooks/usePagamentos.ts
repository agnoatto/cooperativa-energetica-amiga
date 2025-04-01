
/**
 * Hook para gerenciar dados de pagamentos
 * 
 * Este hook busca e gerencia dados de pagamentos de usinas fotovoltaicas,
 * fornecendo funções para gerar novos pagamentos e acompanhar o estado da operação.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchPagamentos } from "./pagamentos/queries";
import { gerarPagamentos } from "./pagamentos/mutations";
import { PagamentoData } from "@/components/pagamentos/types/pagamento";
import { format } from "date-fns";

interface UsePagamentosProps {
  periodo: string;
  busca?: string;
}

export const usePagamentos = ({ periodo, busca }: UsePagamentosProps) => {
  const queryClient = useQueryClient();
  
  // Extrair o ano e mês do período para converter para Date
  const [ano, mes] = periodo.split('-').map(Number);
  const currentDate = new Date(ano, mes - 1); // mês em JS é base 0 (0-11)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["pagamentos", periodo, busca],
    queryFn: () => fetchPagamentos(currentDate),
  });

  const gerarPagamentosMutation = useMutation({
    mutationFn: () => gerarPagamentos(currentDate),
    onSuccess: (usinas) => {
      const count = usinas?.length || 0;
      queryClient.invalidateQueries({ queryKey: ["pagamentos"] });
      if (count > 0) {
        toast.success(`${count} pagamentos gerados com sucesso!`);
      } else {
        toast.info("Todos os pagamentos já foram gerados para este mês.");
      }
    },
    onError: (error) => {
      console.error("Erro ao gerar pagamentos:", error);
      toast.error("Erro ao gerar pagamentos");
    },
  });

  return {
    pagamentos: data as PagamentoData[] | undefined,
    isLoading,
    refetch,
    gerarPagamentos: () => gerarPagamentosMutation.mutate(),
    isGenerating: gerarPagamentosMutation.isPending
  };
};
