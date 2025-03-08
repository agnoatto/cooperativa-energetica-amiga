
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Fatura } from "@/types/fatura";
import { toast } from "sonner";

export interface UpdateFaturaInput {
  id: string;
  consumo_kwh?: number;
  valor_assinatura?: number;
  data_vencimento?: string;
  fatura_concessionaria?: number;
  total_fatura?: number;
  iluminacao_publica?: number;
  outros_valores?: number;
  valor_desconto?: number;
  economia_acumulada?: number;
  saldo_energia_kwh?: number;
  observacao?: string;
  arquivo_concessionaria_nome?: string | null;
  arquivo_concessionaria_path?: string | null;
  arquivo_concessionaria_tipo?: string | null;
  arquivo_concessionaria_tamanho?: number | null;
}

export const useUpdateFatura = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateFaturaInput) => {
      console.log("[useUpdateFatura] Atualizando fatura:", data);

      try {
        // Extrair os campos de arquivo para tratá-los separadamente
        const {
          arquivo_concessionaria_nome,
          arquivo_concessionaria_path,
          arquivo_concessionaria_tipo,
          arquivo_concessionaria_tamanho,
          ...restData
        } = data;

        // Atualizar a tabela faturas com os dados principais
        const { data: updatedFatura, error } = await supabase
          .from('faturas')
          .update({
            ...restData,
            arquivo_concessionaria_nome,
            arquivo_concessionaria_path,
            arquivo_concessionaria_tipo,
            arquivo_concessionaria_tamanho
          })
          .eq('id', data.id)
          .select('*')
          .single();

        if (error) {
          console.error("[useUpdateFatura] Erro ao atualizar fatura:", error);
          throw new Error(`Erro ao atualizar fatura: ${error.message}`);
        }

        if (!updatedFatura) {
          console.error("[useUpdateFatura] Fatura não encontrada após atualização");
          throw new Error("Fatura não encontrada após atualização");
        }

        console.log("[useUpdateFatura] Fatura atualizada com sucesso:", updatedFatura);
        
        // Buscar a fatura completa para retornar com todos os relacionamentos
        const { data: completeFatura, error: completeError } = await supabase
          .from("faturas")
          .select(`
            id,
            consumo_kwh,
            valor_assinatura,
            status,
            data_vencimento,
            mes,
            ano,
            fatura_concessionaria,
            total_fatura,
            iluminacao_publica,
            outros_valores,
            valor_desconto,
            economia_acumulada,
            saldo_energia_kwh,
            observacao,
            arquivo_concessionaria_nome,
            arquivo_concessionaria_path,
            arquivo_concessionaria_tipo,
            arquivo_concessionaria_tamanho,
            unidade_beneficiaria:unidade_beneficiaria_id (
              id,
              numero_uc,
              apelido,
              endereco,
              percentual_desconto,
              cooperado:cooperado_id (
                nome,
                documento
              )
            )
          `)
          .eq("id", data.id)
          .single();

        if (completeError) {
          console.error("[useUpdateFatura] Erro ao buscar fatura completa:", completeError);
          // Ainda retorna a fatura atualizada mesmo sem os relacionamentos
          return updatedFatura as unknown as Fatura;
        }

        return completeFatura as Fatura;
      } catch (error) {
        console.error("[useUpdateFatura] Erro ao processar atualização:", error);
        throw error;
      }
    },
    onSuccess: (updatedFatura, variables) => {
      const date = new Date();
      // Invalidar a consulta para forçar uma atualização dos dados
      queryClient.invalidateQueries({ 
        queryKey: ['faturas', date.getMonth() + 1, date.getFullYear()]
      });
      
      // Atualizar a fatura no cache diretamente para exibição imediata
      queryClient.setQueryData(
        ['faturas', date.getMonth() + 1, date.getFullYear()],
        (oldData: Fatura[] | undefined) => {
          if (!oldData) return undefined;
          return oldData.map(fatura => 
            fatura.id === updatedFatura.id ? { ...fatura, ...updatedFatura } : fatura
          );
        }
      );
      
      toast.success("Fatura atualizada com sucesso!");
    },
    onError: (error) => {
      console.error("[useUpdateFatura] Erro na mutação:", error);
      toast.error(`Erro ao atualizar fatura: ${error.message || "Erro desconhecido"}`);
    }
  });
};
