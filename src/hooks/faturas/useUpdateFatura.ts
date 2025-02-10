
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { calculateValues } from "@/components/faturas/utils/calculateValues";
import { UpdateFaturaInput } from "./types";
import { Fatura } from "@/types/fatura";

export const useUpdateFatura = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateFaturaInput) => {
      console.log('Iniciando atualização da fatura:', data);
      
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
          data_vencimento: data.data_vencimento,
        })
        .eq("id", data.id);

      if (error) throw error;
      
      console.log('Fatura atualizada com sucesso');
      return data;
    },
    onMutate: async (newData) => {
      console.log('Preparando atualização otimista:', newData);
      
      // Cancela queries em andamento
      const date = new Date();
      const queryKey = ['faturas', date.getMonth() + 1, date.getFullYear()];
      await queryClient.cancelQueries({ queryKey });

      // Snapshot do estado anterior
      const previousFaturas = queryClient.getQueryData(queryKey);

      // Atualiza o cache otimisticamente
      queryClient.setQueryData(queryKey, (old: Fatura[] | undefined) => {
        if (!old) return old;
        return old.map(fatura => {
          if (fatura.id === newData.id) {
            const calculatedValues = calculateValues(
              newData.total_fatura.toFixed(2).replace('.', ','),
              newData.iluminacao_publica.toFixed(2).replace('.', ','),
              newData.outros_valores.toFixed(2).replace('.', ','),
              newData.fatura_concessionaria.toFixed(2).replace('.', ','),
              newData.percentual_desconto
            );

            return {
              ...fatura,
              consumo_kwh: newData.consumo_kwh,
              total_fatura: newData.total_fatura,
              fatura_concessionaria: newData.fatura_concessionaria,
              iluminacao_publica: newData.iluminacao_publica,
              outros_valores: newData.outros_valores,
              valor_desconto: calculatedValues.valor_desconto,
              valor_total: calculatedValues.valor_total,
              saldo_energia_kwh: newData.saldo_energia_kwh,
              observacao: newData.observacao,
              data_vencimento: newData.data_vencimento,
            };
          }
          return fatura;
        });
      });

      return { previousFaturas };
    },
    onError: (error, variables, context) => {
      console.error("Erro ao atualizar fatura:", error);
      toast.error("Erro ao atualizar fatura");
      
      if (context?.previousFaturas) {
        const date = new Date();
        queryClient.setQueryData(
          ['faturas', date.getMonth() + 1, date.getFullYear()],
          context.previousFaturas
        );
      }
    },
    onSuccess: (data) => {
      console.log('Mutation concluída com sucesso:', data);
      toast.success("Fatura atualizada com sucesso!");
      
      // Não precisamos mais invalidar a query aqui pois já atualizamos o cache
      // otimisticamente e a mutation foi bem-sucedida
    }
  });
};

