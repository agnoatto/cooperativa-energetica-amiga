
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UpdateFaturaStatusInput } from "./types";
import { StatusHistoryEntry, FaturaStatus, Fatura } from "@/types/fatura";

// Função auxiliar para validar e converter o histórico
const convertToStatusHistory = (history: unknown): StatusHistoryEntry[] => {
  if (!Array.isArray(history)) {
    return [];
  }

  return history.map(entry => {
    if (typeof entry === 'object' && entry !== null) {
      const item = entry as Record<string, unknown>;
      return {
        status: item.status as FaturaStatus,
        data: item.data as string,
        observacao: item.observacao as string | undefined,
        motivo_correcao: item.motivo_correcao as string | undefined,
        campos_alterados: item.campos_alterados as string[] | undefined
      };
    }
    return {
      status: 'gerada' as FaturaStatus,
      data: new Date().toISOString(),
      observacao: 'Registro histórico inválido'
    };
  });
};

export const useUpdateFaturaStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateFaturaStatusInput) => {
      console.log('Iniciando atualização de status da fatura:', data);
      const now = new Date().toISOString();
      
      // Buscar fatura atual para verificar se a atualização é necessária
      const { data: currentFatura, error: fetchError } = await supabase
        .from("faturas")
        .select('*')
        .eq('id', data.id)
        .single();

      if (fetchError) {
        console.error('Erro ao buscar fatura:', fetchError);
        throw new Error('Erro ao buscar fatura: ' + fetchError.message);
      }

      if (!currentFatura) {
        throw new Error('Fatura não encontrada');
      }

      console.log('Fatura atual:', currentFatura);

      // Prepara o histórico usando a função de conversão segura
      const historicoAtual = convertToStatusHistory(currentFatura.historico_status);

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

      const updateData: Record<string, any> = {
        status: data.status,
        historico_status: novoHistorico,
        data_atualizacao: now
      };

      // Adiciona campos específicos baseados no status
      if (data.status === 'enviada' || data.status === 'reenviada') {
        updateData.data_envio = now;
        updateData.send_method = currentFatura.send_method || [];
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

      console.log('Dados para atualização:', updateData);

      // Realiza a atualização
      const { data: updatedFatura, error: updateError } = await supabase
        .from("faturas")
        .update(updateData)
        .eq('id', data.id)
        .select('*')
        .single();

      if (updateError) {
        console.error('Erro ao atualizar fatura:', updateError);
        throw new Error('Erro ao atualizar fatura: ' + updateError.message);
      }

      if (!updatedFatura) {
        throw new Error('Fatura não foi atualizada');
      }

      console.log('Fatura atualizada com sucesso:', updatedFatura);
      return updatedFatura;
    },
    onMutate: async (data) => {
      console.log('Iniciando mutação otimista:', data);
      await queryClient.cancelQueries({ queryKey: ['faturas'] });

      // Snapshot do estado anterior
      const date = new Date();
      const queryKey = ['faturas', date.getMonth() + 1, date.getFullYear()];
      const previousFaturas = queryClient.getQueryData<Fatura[]>(queryKey);

      // Update otimista
      queryClient.setQueryData<Fatura[]>(queryKey, (old) => {
        if (!old) return old;
        return old.map(fatura => {
          if (fatura.id === data.id) {
            const currentHistorico = convertToStatusHistory(fatura.historico_status);
            
            return {
              ...fatura,
              status: data.status,
              historico_status: [
                ...currentHistorico,
                {
                  status: data.status,
                  data: new Date().toISOString(),
                  observacao: data.observacao
                }
              ]
            };
          }
          return fatura;
        });
      });

      return { previousFaturas };
    },
    onError: (error, variables, context) => {
      console.error("Erro na mutação:", error);
      toast.error("Erro ao atualizar status da fatura: " + error.message);
      
      // Reverter alterações otimistas
      if (context?.previousFaturas) {
        const date = new Date();
        const queryKey = ['faturas', date.getMonth() + 1, date.getFullYear()];
        queryClient.setQueryData(queryKey, context.previousFaturas);
      }
    },
    onSuccess: (updatedFatura, variables) => {
      console.log('Mutation concluída com sucesso:', updatedFatura);
      const date = new Date();
      const queryKey = ['faturas', date.getMonth() + 1, date.getFullYear()];
      
      // Força recarregamento dos dados
      queryClient.invalidateQueries({ queryKey });
      
      const statusMessages = {
        enviada: "Fatura enviada com sucesso!",
        corrigida: "Fatura marcada para correção!",
        reenviada: "Fatura reenviada com sucesso!",
        paga: "Pagamento confirmado com sucesso!",
        finalizada: "Fatura finalizada com sucesso!",
        atrasada: "Fatura marcada como atrasada!"
      };
      
      toast.success(statusMessages[variables.status] || "Status da fatura atualizado com sucesso!");
    }
  });
};
