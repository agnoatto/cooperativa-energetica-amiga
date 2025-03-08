
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Fatura } from "@/types/fatura";
import { toast } from "sonner";

export interface UpdateFaturaInput {
  id: string;
  consumo_kwh?: number;
  valor_assinatura?: number;
  data_vencimento?: string;
  fatura_concessionaria?: number;
  total_fatura?: number;
  iluminacao_publica?: number;
  outros_valores?: number;
  valor_desconto?: number;
  economia_acumulada?: number;
  saldo_energia_kwh?: number;
  observacao?: string;
  arquivo_concessionaria_nome?: string | null;
  arquivo_concessionaria_path?: string | null;
  arquivo_concessionaria_tipo?: string | null;
  arquivo_concessionaria_tamanho?: number | null;
}

export const useUpdateFatura = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateFaturaInput) => {
      console.log("[useUpdateFatura] Atualizando fatura:", data);

      try {
        // Usando a função rpc que criamos no banco de dados
        const { data: updatedFatura, error } = await supabase
          .rpc('update_fatura', {
            p_id: data.id,
            p_consumo_kwh: data.consumo_kwh,
            p_valor_assinatura: data.valor_assinatura,
            p_data_vencimento: data.data_vencimento,
            p_fatura_concessionaria: data.fatura_concessionaria,
            p_total_fatura: data.total_fatura,
            p_iluminacao_publica: data.iluminacao_publica,
            p_outros_valores: data.outros_valores,
            p_valor_desconto: data.valor_desconto,
            p_economia_acumulada: data.economia_acumulada,
            p_saldo_energia_kwh: data.saldo_energia_kwh,
            p_observacao: data.observacao,
            p_arquivo_concessionaria_nome: data.arquivo_concessionaria_nome,
            p_arquivo_concessionaria_path: data.arquivo_concessionaria_path,
            p_arquivo_concessionaria_tipo: data.arquivo_concessionaria_tipo,
            p_arquivo_concessionaria_tamanho: data.arquivo_concessionaria_tamanho
          });

        if (error) {
          console.error("[useUpdateFatura] Erro na função RPC ao atualizar fatura:", error);
          throw new Error(`Erro ao atualizar fatura: ${error.message}`);
        }

        if (!updatedFatura) {
          console.error("[useUpdateFatura] Fatura não encontrada após atualização");
          throw new Error("Fatura não encontrada após atualização");
        }

        console.log("[useUpdateFatura] Fatura atualizada com sucesso:", updatedFatura);
        return updatedFatura as unknown as Fatura;
      } catch (error) {
        console.error("[useUpdateFatura] Erro ao processar atualização:", error);
        throw error;
      }
    },
    onSuccess: (updatedFatura, variables) => {
      const date = new Date();
      // Invalidar a consulta para forçar uma atualização dos dados
      queryClient.invalidateQueries({ 
        queryKey: ['faturas', date.getMonth() + 1, date.getFullYear()]
      });
      
      // Atualizar a fatura no cache diretamente para exibição imediata
      queryClient.setQueryData(
        ['faturas', date.getMonth() + 1, date.getFullYear()],
        (oldData: Fatura[] | undefined) => {
          if (!oldData) return undefined;
          return oldData.map(fatura => 
            fatura.id === updatedFatura.id ? { ...fatura, ...updatedFatura } : fatura
          );
        }
      );
      
      toast.success("Fatura atualizada com sucesso!");
    },
    onError: (error) => {
      console.error("[useUpdateFatura] Erro na mutação:", error);
      toast.error(`Erro ao atualizar fatura: ${error.message || "Erro desconhecido"}`);
    }
  });
};
