
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { calculateValues } from "@/components/faturas/utils/calculateValues";
import { UpdateFaturaInput } from "./types";

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

        // Calcula os valores usando as strings formatadas
        const calculatedValues = calculateValues(
          data.total_fatura.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          data.iluminacao_publica.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          data.outros_valores.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          data.fatura_concessionaria.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          data.percentual_desconto
        );

        console.log('Valores calculados antes do envio:', calculatedValues);

        // Verifica se todos os campos obrigatórios estão preenchidos
        const todosPreenchidos = 
          data.consumo_kwh > 0 && 
          data.total_fatura > 0 && 
          data.fatura_concessionaria > 0 && 
          data.data_vencimento;

        // Prepara os dados para o banco garantindo valores numéricos corretos
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
          data_atualizacao: new Date().toISOString(),
          // Atualiza o status se todos os campos obrigatórios estiverem preenchidos
          ...(todosPreenchidos && { 
            status: 'pendente' as const,
            historico_status: [
              {
                status: 'pendente',
                data: new Date().toISOString(),
                observacao: 'Fatura pronta para envio ao cliente'
              }
            ]
          })
        };

        console.log('Dados formatados para envio ao banco:', faturaData);

        const { error, data: updatedFatura } = await supabase
          .from("faturas")
          .update(faturaData)
          .eq("id", data.id)
          .select()
          .single();

        if (error) {
          console.error("Erro Supabase:", error);
          throw new Error(error.message);
        }

        console.log('Fatura atualizada com sucesso:', updatedFatura);
        
        if (todosPreenchidos) {
          toast.success('Fatura atualizada e marcada como pendente');
        } else {
          toast.success('Fatura atualizada com sucesso');
        }

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
