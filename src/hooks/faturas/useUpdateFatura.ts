
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { calculateValues } from "@/components/faturas/utils/calculateValues";
import { UpdateFaturaInput } from "./types";

export const useUpdateFatura = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateFaturaInput) => {
      const calculatedValues = calculateValues(
        data.total_fatura.toFixed(2).replace('.', ','),
        data.iluminacao_publica.toFixed(2).replace('.', ','),
        data.outros_valores.toFixed(2).replace('.', ','),
        data.fatura_concessionaria.toFixed(2).replace('.', ','),
        data.percentual_desconto
      );

      const { error } = await supabase
        .from("faturas")
        .update({
          consumo_kwh: data.consumo_kwh,
          total_fatura: data.total_fatura,
          fatura_concessionaria: data.fatura_concessionaria,
          iluminacao_publica: data.iluminacao_publica,
          outros_valores: data.outros_valores,
          valor_desconto: calculatedValues.valor_desconto,
          valor_total: calculatedValues.valor_total,
          saldo_energia_kwh: data.saldo_energia_kwh,
          observacao: data.observacao,
        })
        .eq("id", data.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faturas"] });
      toast.success("Fatura atualizada com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao atualizar fatura:", error);
      toast.error("Erro ao atualizar fatura");
    },
  });
};
