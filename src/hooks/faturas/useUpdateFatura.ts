
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
        console.log('[useUpdateFatura] Dados recebidos para atualização:', data);

        // Calcular valores usando os dados recebidos
        console.log('[useUpdateFatura] Calculando valores com: ', {
          total_fatura: data.total_fatura.toString(),
          iluminacao_publica: data.iluminacao_publica.toString(),
          outros_valores: data.outros_valores.toString(),
          fatura_concessionaria: data.fatura_concessionaria.toString(),
          percentual_desconto: data.percentual_desconto
        });
        
        const calculatedValues = calculateValues(
          data.total_fatura.toString(),
          data.iluminacao_publica.toString(),
          data.outros_valores.toString(),
          data.fatura_concessionaria.toString(),
          data.percentual_desconto
        );

        console.log('[useUpdateFatura] Valores calculados:', calculatedValues);

        // Preparar os dados para atualização
        const faturaData = {
          consumo_kwh: Number(data.consumo_kwh),
          total_fatura: Number(data.total_fatura),
          fatura_concessionaria: Number(data.fatura_concessionaria),
          iluminacao_publica: Number(data.iluminacao_publica),
          outros_valores: Number(data.outros_valores),
          valor_desconto: Number(calculatedValues.valor_desconto),
          valor_assinatura: Number(calculatedValues.valor_assinatura),
          saldo_energia_kwh: Number(data.saldo_energia_kwh),
          observacao: data.observacao,
          data_vencimento: data.data_vencimento,
          data_atualizacao: new Date().toISOString(),
          // Campos de arquivo
          arquivo_concessionaria_nome: data.arquivo_concessionaria_nome,
          arquivo_concessionaria_path: data.arquivo_concessionaria_path,
          arquivo_concessionaria_tipo: data.arquivo_concessionaria_tipo,
          arquivo_concessionaria_tamanho: data.arquivo_concessionaria_tamanho
        };

        console.log('[useUpdateFatura] Dados formatados para atualização:', faturaData);
        console.log('[useUpdateFatura] Enviando atualização para o Supabase para fatura ID:', data.id);

        const { error: updateError, data: updatedFatura } = await supabase
          .from("faturas")
          .update(faturaData)
          .eq("id", data.id)
          .select()
          .single();

        if (updateError) {
          console.error("[useUpdateFatura] Erro ao atualizar fatura:", updateError);
          throw new Error(updateError.message);
        }

        console.log('[useUpdateFatura] Fatura atualizada com sucesso:', updatedFatura);
        toast.success('Fatura atualizada com sucesso');

        return updatedFatura;
      } catch (error: any) {
        console.error("[useUpdateFatura] Erro detalhado ao atualizar fatura:", error);
        toast.error(`Erro ao atualizar fatura: ${error.message || "Erro desconhecido"}`);
        throw new Error(error.message || "Erro ao atualizar fatura");
      }
    },
    onSuccess: async (_, variables) => {
      try {
        console.log('[useUpdateFatura] Sucesso! Invalidando queries de cache...');
        
        // Obtém o mês e ano da fatura atualizada
        const faturaDate = new Date(variables.data_vencimento);
        const mes = faturaDate.getMonth() + 1;
        const ano = faturaDate.getFullYear();

        console.log(`[useUpdateFatura] Invalidando cache para faturas de ${mes}/${ano}`);

        // Invalida o cache específico para este mês/ano
        await queryClient.invalidateQueries({ 
          queryKey: ['faturas', mes, ano]
        });

        // Força uma nova busca dos dados
        console.log(`[useUpdateFatura] Forçando nova busca para faturas de ${mes}/${ano}`);
        await queryClient.refetchQueries({ 
          queryKey: ['faturas', mes, ano],
          exact: true
        });

        // Invalidar todas as consultas de faturas para garantir atualização
        console.log('[useUpdateFatura] Invalidando todas as consultas de faturas');
        await queryClient.invalidateQueries({
          queryKey: ['faturas']
        });
        
        console.log('[useUpdateFatura] Cache atualizado com sucesso');
      } catch (error) {
        console.error("[useUpdateFatura] Erro ao atualizar cache:", error);
      }
    },
    onError: (error) => {
      console.error("[useUpdateFatura] Erro na mutação:", error);
      toast.error(`Falha ao atualizar fatura: ${error.message || "Erro desconhecido"}`);
    }
  });
};
