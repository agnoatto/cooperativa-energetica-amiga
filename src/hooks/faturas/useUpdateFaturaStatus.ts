
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UpdateFaturaStatusInput } from "./types";
import { StatusHistoryEntry, FaturaStatus, Fatura } from "@/types/fatura";

const convertToStatusHistory = (history: unknown): StatusHistoryEntry[] => {
  if (!Array.isArray(history)) return [];
  
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

// Função auxiliar para converter StatusHistoryEntry[] para formato JSON
const convertHistoryToJson = (history: StatusHistoryEntry[]): Record<string, any>[] => {
  return history.map(entry => ({
    status: entry.status,
    data: entry.data,
    observacao: entry.observacao,
    motivo_correcao: entry.motivo_correcao,
    campos_alterados: entry.campos_alterados
  }));
};

export const useUpdateFaturaStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, observacao }: UpdateFaturaStatusInput) => {
      const now = new Date().toISOString();
      
      const { data: currentFatura, error: fetchError } = await supabase
        .from("faturas")
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw new Error('Erro ao buscar fatura: ' + fetchError.message);
      if (!currentFatura) throw new Error('Fatura não encontrada');

      const historicoAtual = convertToStatusHistory(currentFatura.historico_status);
      const novoHistorico = [
        ...historicoAtual,
        { status, data: now, observacao }
      ];

      // Convertendo o histórico para formato JSON antes de enviar ao Supabase
      const updateData = {
        status,
        historico_status: convertHistoryToJson(novoHistorico),
        data_atualizacao: now,
        ...(status === 'enviada' && { data_envio: now }),
        ...(status === 'paga' && { 
          data_confirmacao_pagamento: now,
          data_pagamento: now
        })
      };

      const { data: updatedFatura, error: updateError } = await supabase
        .from("faturas")
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw new Error('Erro ao atualizar fatura: ' + updateError.message);
      if (!updatedFatura) throw new Error('Fatura não foi atualizada');

      return updatedFatura;
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['faturas'] });

      const date = new Date();
      const queryKey = ['faturas', date.getMonth() + 1, date.getFullYear()];
      const previousFaturas = queryClient.getQueryData<Fatura[]>(queryKey);

      queryClient.setQueryData<Fatura[]>(queryKey, (old) => {
        if (!old) return old;
        return old.map(fatura => {
          if (fatura.id === data.id) {
            const currentHistorico = convertToStatusHistory(fatura.historico_status);
            const novoHistorico = [
              ...currentHistorico,
              {
                status: data.status,
                data: new Date().toISOString(),
                observacao: data.observacao
              }
            ];
            
            return {
              ...fatura,
              status: data.status,
              historico_status: convertHistoryToJson(novoHistorico)
            };
          }
          return fatura;
        });
      });

      return { previousFaturas };
    },
    onError: (error, _, context) => {
      console.error("Erro na mutação:", error);
      toast.error("Erro ao atualizar status da fatura: " + error.message);
      
      if (context?.previousFaturas) {
        const date = new Date();
        const queryKey = ['faturas', date.getMonth() + 1, date.getFullYear()];
        queryClient.setQueryData(queryKey, context.previousFaturas);
      }
    },
    onSuccess: (_, variables) => {
      const date = new Date();
      queryClient.invalidateQueries({ 
        queryKey: ['faturas', date.getMonth() + 1, date.getFullYear()]
      });
      
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
