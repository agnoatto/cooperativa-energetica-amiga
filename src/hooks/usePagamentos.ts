
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchPagamentos } from "./pagamentos/queries";
import { gerarPagamentos } from "./pagamentos/mutations";

export const usePagamentos = (currentDate: Date) => {
  const queryClient = useQueryClient();

  const { data: pagamentos, isLoading } = useQuery({
    queryKey: ["pagamentos", currentDate],
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
    pagamentos,
    isLoading,
    gerarPagamentos: () => gerarPagamentosMutation.mutate(),
    isGenerating: gerarPagamentosMutation.isPending
  };
};
