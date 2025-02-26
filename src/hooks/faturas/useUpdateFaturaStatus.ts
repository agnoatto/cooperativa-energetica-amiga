
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UpdateFaturaStatusInput } from "./types";
import { FaturaStatus, Fatura } from "@/types/fatura";
import { Database } from "@/integrations/supabase/types";
import { Json } from "@/integrations/supabase/types";

type FaturaTable = Database['public']['Tables']['faturas'];
type DbFaturaStatus = FaturaTable['Row']['status'];

const validateStatusTransition = (currentStatus: FaturaStatus, newStatus: FaturaStatus): boolean => {
  // Simplificação das transições permitidas
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

  const isAllowed = allowedTransitions[currentStatus]?.includes(newStatus) || false;
  console.log('Validação de transição:', {
    de: currentStatus,
    para: newStatus,
    permitido: isAllowed
  });
  return isAllowed;
};

export const useUpdateFaturaStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, observacao, motivo_correcao }: UpdateFaturaStatusInput) => {
      try {
        console.log('Iniciando atualização de status:', { id, status, observacao });
        
        // 1. Buscar fatura atual
        const { data: currentFatura, error: fetchError } = await supabase
          .from("faturas")
          .select('*, unidade_beneficiaria (*)')
          .eq('id', id)
          .single();

        if (fetchError) {
          console.error('Erro ao buscar fatura:', fetchError);
          throw new Error(`Erro ao buscar fatura: ${fetchError.message}`);
        }
        
        if (!currentFatura) {
          console.error('Fatura não encontrada');
          throw new Error('Fatura não encontrada');
        }

        // 2. Validar transição de status
        if (!validateStatusTransition(currentFatura.status, status)) {
          const errorMsg = `Transição de status inválida: ${currentFatura.status} -> ${status}`;
          console.error(errorMsg);
          throw new Error(errorMsg);
        }

        // 3. Preparar dados para atualização
        const now = new Date().toISOString();
        const updateData = {
          status: status as DbFaturaStatus,
          historico_status: [
            ...(Array.isArray(currentFatura.historico_status) ? currentFatura.historico_status : []),
            {
              status,
              data: now,
              observacao,
              ...(motivo_correcao && { motivo_correcao })
            }
          ] as Json,
          data_atualizacao: now,
          ...(status === 'enviada' && { data_envio: now }),
          ...(status === 'paga' && {
            data_confirmacao_pagamento: now,
            data_pagamento: now
          })
        };

        console.log('Dados preparados para atualização:', updateData);

        // 4. Atualizar fatura
        const { data: updatedFatura, error: updateError } = await supabase
          .from("faturas")
          .update(updateData)
          .eq('id', id)
          .select('*, unidade_beneficiaria (*)')
          .single();

        if (updateError) {
          console.error('Erro ao atualizar fatura:', updateError);
          throw new Error(`Erro ao atualizar fatura: ${updateError.message}`);
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
