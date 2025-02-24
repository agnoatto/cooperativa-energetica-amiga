
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UpdateFaturaStatusInput } from "./types";
import { StatusHistoryEntry, FaturaStatus, Fatura } from "@/types/fatura";

export const useUpdateFaturaStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateFaturaStatusInput) => {
      console.log('Atualizando status da fatura:', data);
      const now = new Date().toISOString();
      
      // Buscar histórico atual
      const { data: fatura, error: fetchError } = await supabase
        .from("faturas")
        .select('historico_status, status')
        .eq('id', data.id)
        .single();

      if (fetchError) {
        console.error('Erro ao buscar histórico da fatura:', fetchError);
        throw fetchError;
      }

      // Convert the raw JSON data to our type safely
      const historicoAtual = (fatura?.historico_status as Array<{
        status: FaturaStatus;
        data: string;
        observacao?: string;
        motivo_correcao?: string;
        campos_alterados?: string[];
      }> || []);

      const novoHistorico: StatusHistoryEntry[] = [
        ...historicoAtual,
        {
          status: data.status,
          data: now,
          observacao: data.observacao,
          motivo_correcao: data.motivo_correcao,
          campos_alterados: data.campos_alterados
        }
      ];

      console.log('Histórico atualizado:', novoHistorico);
      console.log('Novo status:', data.status);

      const updateData: Record<string, any> = {
        status: data.status,
        historico_status: novoHistorico
      };

      // Adicionar campos específicos baseados no status
      if (data.status === 'enviada' || data.status === 'reenviada') {
        updateData.data_envio = now;
      } else if (data.status === 'paga') {
        updateData.data_confirmacao_pagamento = now;
        if (data.data_pagamento) {
          updateData.data_pagamento = data.data_pagamento;
        }
        if (data.valor_adicional !== undefined) {
          updateData.valor_adicional = data.valor_adicional;
        }
        if (data.observacao_pagamento !== undefined) {
          updateData.observacao_pagamento = data.observacao_pagamento;
        }
      }

      console.log('Dados de atualização:', updateData);

      const { error: updateError, data: updatedFatura } = await supabase
        .from("faturas")
        .update(updateData)
        .eq("id", data.id)
        .select()
        .single();

      if (updateError) {
        console.error('Erro ao atualizar fatura:', updateError);
        throw updateError;
      }

      console.log('Fatura atualizada com sucesso:', updatedFatura);
      return updatedFatura;
    },
    onMutate: async (data) => {
      // Mostra toast de loading
      toast.loading("Atualizando status da fatura...");

      // Cancela queries em andamento para evitar sobrescrever nosso update otimista
      await queryClient.cancelQueries({
        queryKey: ['faturas']
      });

      // Snapshot do estado anterior
      const date = new Date();
      const previousFaturas = queryClient.getQueryData(
        ['faturas', date.getMonth() + 1, date.getFullYear()]
      );

      // Atualiza o cache otimisticamente
      queryClient.setQueryData(['faturas', date.getMonth() + 1, date.getFullYear()], 
        (old: Fatura[] | undefined) => {
          if (!old) return old;
          return old.map(fatura => {
            if (fatura.id === data.id) {
              return {
                ...fatura,
                status: data.status,
                historico_status: [
                  ...(fatura.historico_status || []),
                  {
                    status: data.status,
                    data: new Date().toISOString(),
                    observacao: data.observacao,
                    motivo_correcao: data.motivo_correcao,
                    campos_alterados: data.campos_alterados
                  }
                ]
              };
            }
            return fatura;
          });
        }
      );

      return { previousFaturas };
    },
    onError: (error, variables, context) => {
      console.error("Erro ao atualizar status da fatura:", error);
      toast.error("Erro ao atualizar status da fatura");
      
      // Reverte para o estado anterior em caso de erro
      if (context?.previousFaturas) {
        const date = new Date();
        queryClient.setQueryData(
          ['faturas', date.getMonth() + 1, date.getFullYear()],
          context.previousFaturas
        );
      }
    },
    onSuccess: (updatedFatura, variables) => {
      console.log('Mutation concluída com sucesso:', updatedFatura);
      const date = new Date();
      
      // Invalida e recarrega os dados
      queryClient.invalidateQueries({
        queryKey: ['faturas', date.getMonth() + 1, date.getFullYear()]
      });
      
      // Mensagem específica baseada no novo status
      const statusMessages = {
        enviada: "Fatura enviada com sucesso!",
        corrigida: "Fatura marcada para correção!",
        reenviada: "Fatura reenviada com sucesso!",
        paga: "Pagamento confirmado com sucesso!",
        finalizada: "Fatura finalizada com sucesso!",
        atrasada: "Fatura marcada como atrasada!"
      };
      
      toast.success(statusMessages[variables.status] || "Status da fatura atualizado com sucesso!");

      // Força recarregamento dos dados após sucesso
      queryClient.refetchQueries({
        queryKey: ['faturas', date.getMonth() + 1, date.getFullYear()]
      });
    }
  });
};
