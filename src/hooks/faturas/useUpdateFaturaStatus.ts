
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UpdateFaturaStatusInput } from "./types";
import { StatusHistoryEntry, FaturaStatus, Fatura } from "@/types/fatura";
import { Json } from "@/integrations/supabase/types";
import { Database } from "@/integrations/supabase/types";

type FaturaTable = Database['public']['Tables']['faturas'];
type DbFaturaStatus = FaturaTable['Row']['status'];

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

const convertHistoryToJson = (history: StatusHistoryEntry[]): Json => {
  return history.map(entry => ({
    status: entry.status,
    data: entry.data,
    observacao: entry.observacao,
    motivo_correcao: entry.motivo_correcao,
    campos_alterados: entry.campos_alterados
  })) as Json;
};

const validateStatusTransition = (currentStatus: FaturaStatus, newStatus: FaturaStatus): boolean => {
  const allowedTransitions: Record<FaturaStatus, FaturaStatus[]> = {
    'gerada': ['pendente'],
    'pendente': ['enviada'],
    'enviada': ['corrigida', 'atrasada', 'paga'],
    'corrigida': ['reenviada'],
    'reenviada': ['corrigida', 'atrasada', 'paga'],
    'atrasada': ['paga'],
    'paga': ['finalizada'],
    'finalizada': []
  };

  return allowedTransitions[currentStatus]?.includes(newStatus) || false;
};

type FaturaUpdateData = {
  status: DbFaturaStatus;
  historico_status: Json;
  data_atualizacao: string;
  data_envio?: string;
  data_confirmacao_pagamento?: string;
  data_pagamento?: string;
}

export const useUpdateFaturaStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, observacao, motivo_correcao }: UpdateFaturaStatusInput) => {
      try {
        console.log('Iniciando atualização de status:', { id, status, observacao });
        
        const now = new Date().toISOString();
        
        const { data: currentFatura, error: fetchError } = await supabase
          .from("faturas")
          .select('*, unidade_beneficiaria (*)')
          .eq('id', id)
          .single();

        if (fetchError) {
          console.error('Erro ao buscar fatura:', fetchError);
          throw new Error('Erro ao buscar fatura: ' + fetchError.message);
        }
        
        if (!currentFatura) {
          console.error('Fatura não encontrada');
          throw new Error('Fatura não encontrada');
        }

        // Validar transição de status
        if (!validateStatusTransition(currentFatura.status, status)) {
          console.error('Transição de status inválida:', { de: currentFatura.status, para: status });
          throw new Error(`Transição de status inválida: ${currentFatura.status} -> ${status}`);
        }

        const historicoAtual = convertToStatusHistory(currentFatura.historico_status);
        const novoHistorico = [
          ...historicoAtual,
          { 
            status,
            data: now,
            observacao,
            ...(motivo_correcao && { motivo_correcao })
          }
        ];

        const updateData: FaturaUpdateData = {
          status: status as DbFaturaStatus,
          historico_status: convertHistoryToJson(novoHistorico),
          data_atualizacao: now
        };

        // Atualizar campos específicos baseado no status
        if (status === 'enviada' || status === 'reenviada') {
          updateData.data_envio = now;
        } else if (status === 'paga') {
          updateData.data_confirmacao_pagamento = now;
          updateData.data_pagamento = now;
        }

        console.log('Dados preparados para atualização:', updateData);

        const { data: updatedFatura, error: updateError } = await supabase
          .from("faturas")
          .update(updateData)
          .eq('id', id)
          .select('*, unidade_beneficiaria (*)')
          .single();

        if (updateError) {
          console.error('Erro ao atualizar fatura:', updateError);
          throw new Error('Erro ao atualizar fatura: ' + updateError.message);
        }

        if (!updatedFatura) {
          console.error('Fatura não foi atualizada');
          throw new Error('Fatura não foi atualizada');
        }

        console.log('Fatura atualizada com sucesso:', updatedFatura);
        return updatedFatura as unknown as Fatura;
      } catch (error: any) {
        console.error('Erro na mutação:', error);
        throw error;
      }
    },
    onMutate: async (variables) => {
      // Cancelar consultas em andamento
      await queryClient.cancelQueries({ queryKey: ['faturas'] });

      // Snapshot do estado anterior
      const date = new Date();
      const queryKey = ['faturas', date.getMonth() + 1, date.getFullYear()];
      const previousFaturas = queryClient.getQueryData<Fatura[]>(queryKey);

      // Otimisticamente atualizar o cache
      queryClient.setQueryData<Fatura[]>(queryKey, (old) => {
        if (!old) return [];
        return old.map(fatura => {
          if (fatura.id === variables.id) {
            const currentHistorico = convertToStatusHistory(fatura.historico_status);
            const novoHistorico = [
              ...currentHistorico,
              {
                status: variables.status,
                data: new Date().toISOString(),
                observacao: variables.observacao,
                motivo_correcao: variables.motivo_correcao
              }
            ] as StatusHistoryEntry[];
            
            return {
              ...fatura,
              status: variables.status,
              historico_status: novoHistorico
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
        atrasada: "Fatura marcada como atrasada!",
        pendente: "Fatura marcada como pendente!"
      };
      
      toast.success(statusMessages[variables.status] || "Status da fatura atualizado com sucesso!");
    }
  });
};
