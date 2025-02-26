
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { calculateValues } from "@/components/faturas/utils/calculateValues";
import { UpdateFaturaInput } from "./types";
import { StatusHistoryEntry } from "@/types/fatura";
import { Json } from "@/integrations/supabase/types";

const parseHistoricoStatus = (historico: unknown): StatusHistoryEntry[] => {
  if (!Array.isArray(historico)) return [];
  
  return historico.map(entry => {
    if (typeof entry === 'object' && entry !== null) {
      return {
        status: String(entry.status),
        data: String(entry.data),
        observacao: entry.observacao ? String(entry.observacao) : undefined,
        motivo_correcao: entry.motivo_correcao ? String(entry.motivo_correcao) : undefined,
        campos_alterados: Array.isArray(entry.campos_alterados) ? entry.campos_alterados.map(String) : undefined
      } as StatusHistoryEntry;
    }
    return {
      status: 'gerada',
      data: new Date().toISOString(),
      observacao: 'Registro histórico inválido'
    };
  });
};

const convertToJson = (historico: StatusHistoryEntry[]): Json => {
  return historico.map(entry => ({
    status: entry.status,
    data: entry.data,
    observacao: entry.observacao,
    motivo_correcao: entry.motivo_correcao,
    campos_alterados: entry.campos_alterados
  })) as Json;
};

export const useUpdateFatura = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateFaturaInput) => {
      try {
        console.log('Dados recebidos para atualização:', data);

        // Busca a fatura atual para preservar dados históricos
        const { data: currentFatura, error: fetchError } = await supabase
          .from("faturas")
          .select("*")
          .eq("id", data.id)
          .single();

        if (fetchError) {
          console.error("Erro ao buscar fatura atual:", fetchError);
          throw new Error(fetchError.message);
        }

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

        // Calcula os valores usando números diretamente
        const calculatedValues = calculateValues(
          data.total_fatura.toString(),
          data.iluminacao_publica.toString(),
          data.outros_valores.toString(),
          data.fatura_concessionaria.toString(),
          data.percentual_desconto
        );

        console.log('Valores calculados:', calculatedValues);

        // Verifica se todos os campos obrigatórios estão preenchidos
        const todosPreenchidos = 
          data.consumo_kwh > 0 && 
          data.total_fatura > 0 && 
          data.fatura_concessionaria > 0 && 
          data.data_vencimento;

        // Prepara o histórico de status
        const historicoAtual = parseHistoricoStatus(currentFatura.historico_status);
        let novoHistorico = [...historicoAtual];
        
        // Só adiciona novo status se a fatura estiver como 'gerada' e todos os campos estiverem preenchidos
        if (currentFatura.status === 'gerada' && todosPreenchidos) {
          novoHistorico.push({
            status: 'pendente',
            data: new Date().toISOString(),
            observacao: 'Fatura pronta para envio ao cliente'
          });
        }

        // Prepara os dados para atualização
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
          historico_status: convertToJson(novoHistorico),
          // Só atualiza o status se a fatura estiver como 'gerada' e todos os campos estiverem preenchidos
          ...(currentFatura.status === 'gerada' && todosPreenchidos && {
            status: 'pendente'
          })
        };

        console.log('Dados formatados para atualização:', faturaData);

        const { error: updateError, data: updatedFatura } = await supabase
          .from("faturas")
          .update(faturaData)
          .eq("id", data.id)
          .select()
          .single();

        if (updateError) {
          console.error("Erro ao atualizar fatura:", updateError);
          throw new Error(updateError.message);
        }

        console.log('Fatura atualizada com sucesso:', updatedFatura);

        if (currentFatura.status === 'gerada' && todosPreenchidos) {
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
      // Obtém o mês e ano da fatura atualizada
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
