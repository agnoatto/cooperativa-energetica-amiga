
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
}

export const useUpdateFatura = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateFaturaInput) => {
      console.log("[useUpdateFatura] Atualizando fatura:", data);

      const { data: updatedFatura, error } = await supabase
        .from("faturas")
        .update({
          consumo_kwh: data.consumo_kwh,
          valor_assinatura: data.valor_assinatura,
          data_vencimento: data.data_vencimento,
          fatura_concessionaria: data.fatura_concessionaria,
          total_fatura: data.total_fatura,
          iluminacao_publica: data.iluminacao_publica,
          outros_valores: data.outros_valores,
          valor_desconto: data.valor_desconto,
          economia_acumulada: data.economia_acumulada,
          saldo_energia_kwh: data.saldo_energia_kwh,
          observacao: data.observacao
        })
        .eq("id", data.id)
        .select("*")
        .single();

      if (error) {
        console.error("[useUpdateFatura] Erro ao atualizar fatura:", error);
        throw new Error(`Erro ao atualizar fatura: ${error.message}`);
      }

      return updatedFatura as unknown as Fatura;
    },
    onSuccess: () => {
      const date = new Date();
      queryClient.invalidateQueries({ 
        queryKey: ['faturas', date.getMonth() + 1, date.getFullYear()]
      });
      toast.success("Fatura atualizada com sucesso!");
    },
    onError: (error) => {
      console.error("[useUpdateFatura] Erro na mutação:", error);
      toast.error(`Erro ao atualizar fatura: ${error.message || "Erro desconhecido"}`);
    }
  });
};
