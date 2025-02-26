
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { calculateValues } from "@/components/faturas/utils/calculateValues";
import { UpdateFaturaInput } from "./types";
import { StatusHistoryEntry } from "@/types/fatura";
import { Json } from "@/integrations/supabase/types";

export const useUpdateFatura = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateFaturaInput) => {
      try {
        console.log('Dados recebidos para atualização:', data);

        // Validações básicas
        if (data.consumo_kwh <= 0) {
          throw new Error("O consumo deve ser maior que zero");
        }

        if (data.total_fatura <= 0) {
          throw new Error("O valor total da fatura deve ser maior que zero");
        }

        if (!data.data_vencimento) {
          throw new Error("A data de vencimento é obrigatória");
        }

        // Primeiro, busca a fatura atual para verificar o status
        const { data: currentFatura, error: fetchError } = await supabase
          .from("faturas")
          .select('*, historico_status')
          .eq('id', data.id)
          .single();

        if (fetchError) {
          throw new Error('Erro ao buscar fatura atual: ' + fetchError.message);
        }

        // Calcula os valores usando as strings formatadas
        const calculatedValues = calculateValues(
          data.total_fatura.toString(),
          data.iluminacao_publica.toString(),
          data.outros_valores.toString(),
          data.fatura_concessionaria.toString(),
          data.percentual_desconto
        );

        console.log('Valores calculados antes do envio:', calculatedValues);

        // Prepara os dados base para atualização
        const faturaData = {
          consumo_kwh: Number(data.consumo_kwh),
          total_fatura: Number(data.total_fatura.toFixed(2)),
          fatura_concessionaria: Number(data.fatura_concessionaria.toFixed(2)),
          iluminacao_publica: Number(data.iluminacao_publica.toFixed(2)),
          outros_valores: Number(data.outros_valores.toFixed(2)),
          valor_desconto: Number(calculatedValues.valor_desconto.toFixed(2)),
          valor_assinatura: Number(calculatedValues.valor_assinatura.toFixed(2)),
          saldo_energia_kwh: Number(data.saldo_energia_kwh),
          observacao: data.observacao,
          data_vencimento: data.data_vencimento,
          data_atualizacao: new Date().toISOString()
        };

        // Verifica se todos os campos obrigatórios foram preenchidos
        const todosPreenchidos = 
          data.data_vencimento && 
          data.consumo_kwh > 0 && 
          data.total_fatura > 0 && 
          data.fatura_concessionaria > 0;

        // Se todos os campos estiverem preenchidos e o status atual for 'gerada',
        // atualiza o status para 'pendente'
        if (todosPreenchidos && currentFatura.status === 'gerada') {
          // Garante que historico_status seja um array
          const historicoAtual = (currentFatura.historico_status || []) as StatusHistoryEntry[];

          const novaEntrada: StatusHistoryEntry = {
            status: 'pendente',
            data: new Date().toISOString(),
            observacao: 'Fatura pronta para envio ao cliente'
          };

          // Adiciona o status e histórico aos dados de atualização
          Object.assign(faturaData, {
            status: 'pendente',
            historico_status: [...historicoAtual, novaEntrada] as Json
          });
        }

        console.log('Dados formatados para envio ao banco:', faturaData);

        const { error: updateError, data: updatedFatura } = await supabase
          .from("faturas")
          .update(faturaData)
          .eq("id", data.id)
          .select()
          .single();

        if (updateError) {
          console.error("Erro Supabase:", updateError);
          throw new Error(updateError.message);
        }

        console.log('Fatura atualizada com sucesso:', updatedFatura);
        return updatedFatura;
      } catch (error: any) {
        console.error("Erro detalhado ao atualizar fatura:", error);
        throw new Error(error.message || "Erro ao atualizar fatura");
      }
    },
    onSuccess: async (_, variables) => {
      // Obtém o mês e ano da fatura atualizada a partir da data de vencimento
      const faturaDate = new Date(variables.data_vencimento);
      const mes = faturaDate.getMonth() + 1;
      const ano = faturaDate.getFullYear();

      // Invalida o cache específico para este mês/ano
      await queryClient.invalidateQueries({ 
        queryKey: ['faturas', mes, ano]
      });

      // Força uma nova busca dos dados
      await queryClient.refetchQueries({ 
        queryKey: ['faturas', mes, ano],
        exact: true
      });
    }
  });
};
