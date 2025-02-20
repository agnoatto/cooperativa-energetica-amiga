
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { lastDayOfMonth, startOfMonth } from "date-fns";
import { UnidadeBeneficiaria } from "./types";
import { FaturaStatus, StatusHistoryEntry } from "@/types/fatura";

interface NovaFatura {
  unidade_beneficiaria_id: string;
  mes: number;
  ano: number;
  consumo_kwh: number;
  total_fatura: number;
  status: FaturaStatus;
  data_vencimento: string;
  economia_acumulada: number;
  economia_mes: number;
  saldo_energia_kwh: number;
  fatura_concessionaria: number;
  iluminacao_publica: number;
  outros_valores: number;
  valor_desconto: number;
  valor_assinatura: number;
  historico_status: Record<string, any>[];
  data_criacao: string;
  data_atualizacao: string;
}

export const useGerarFaturas = (currentDate: Date) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        console.log("Iniciando geração de faturas...");
        
        const mes = currentDate.getMonth() + 1;
        const ano = currentDate.getFullYear();
        const inicioDiaMes = startOfMonth(currentDate).toISOString();
        const ultimoDiaMes = lastDayOfMonth(currentDate).toISOString().split('T')[0];
        
        console.log(`Gerando faturas para ${mes}/${ano}`);
        console.log(`Início do mês: ${inicioDiaMes}`);
        console.log(`Último dia do mês: ${ultimoDiaMes}`);

        // Busca unidades elegíveis com todos os campos necessários
        const { data: unidades, error: unidadesError } = await supabase
          .from("unidades_beneficiarias")
          .select(`
            id,
            numero_uc,
            apelido,
            data_entrada,
            percentual_desconto,
            cooperado:cooperado_id (
              id,
              nome
            )
          `)
          .filter('data_saida', 'is', null)
          .lte('data_entrada', ultimoDiaMes)
          .gt('data_entrada', inicioDiaMes);

        if (unidadesError) {
          console.error("Erro ao buscar unidades:", unidadesError);
          throw new Error("Erro ao buscar unidades beneficiárias");
        }

        console.log(`Encontradas ${unidades?.length || 0} unidades ativas`);

        if (!unidades || unidades.length === 0) {
          return { faturasGeradas: 0, message: "Não há unidades elegíveis para geração de faturas." };
        }

        let faturasGeradas = 0;
        let erros = 0;

        // Processa cada unidade
        for (const unidade of unidades) {
          try {
            console.log(`Processando unidade ${unidade.numero_uc}`);

            // Verifica se já existe fatura
            const { data: faturasExistentes, error: checkError } = await supabase
              .from("faturas")
              .select('id')
              .eq("unidade_beneficiaria_id", unidade.id)
              .eq("mes", mes)
              .eq("ano", ano);

            if (checkError) {
              console.error(`Erro ao verificar fatura existente: ${checkError.message}`);
              erros++;
              continue;
            }

            if (faturasExistentes && faturasExistentes.length > 0) {
              console.log(`Fatura já existe para unidade ${unidade.numero_uc}`);
              continue;
            }

            const status: FaturaStatus = "gerada";
            const historicoStatus = [{
              status,
              data: new Date().toISOString(),
              observacao: "Fatura gerada automaticamente pelo sistema"
            }] as Record<string, any>[];

            // Prepara dados da nova fatura com valores default
            const novaFatura: NovaFatura = {
              unidade_beneficiaria_id: unidade.id,
              mes,
              ano,
              consumo_kwh: 0,
              total_fatura: 0,
              status,
              data_vencimento: ultimoDiaMes,
              economia_acumulada: 0,
              economia_mes: 0,
              saldo_energia_kwh: 0,
              fatura_concessionaria: 0,
              iluminacao_publica: 0,
              outros_valores: 0,
              valor_desconto: 0,
              valor_assinatura: 0,
              historico_status: historicoStatus,
              data_criacao: new Date().toISOString(),
              data_atualizacao: new Date().toISOString()
            };

            // Insere a nova fatura e retorna os dados inseridos
            const { data: faturaInserida, error: insertError } = await supabase
              .from("faturas")
              .insert(novaFatura)
              .select()
              .maybeSingle();

            if (insertError) {
              console.error(`Erro ao inserir fatura para unidade ${unidade.numero_uc}:`, insertError);
              erros++;
              continue;
            }

            if (!faturaInserida) {
              console.error(`Fatura não foi inserida para unidade ${unidade.numero_uc}`);
              erros++;
              continue;
            }

            console.log(`Fatura gerada com sucesso:`, faturaInserida);
            faturasGeradas++;

          } catch (error) {
            console.error(`Erro ao processar unidade ${unidade.numero_uc}:`, error);
            erros++;
          }
        }

        console.log(`Processo finalizado. Faturas geradas: ${faturasGeradas}, Erros: ${erros}`);

        return {
          faturasGeradas,
          erros,
          message: erros > 0 
            ? `${faturasGeradas} faturas geradas com sucesso e ${erros} erros encontrados.`
            : `${faturasGeradas} faturas geradas com sucesso!`
        };
      } catch (error) {
        console.error("Erro na geração de faturas:", error);
        throw error;
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["faturas"] });
      
      if (result.faturasGeradas > 0) {
        toast.success(result.message);
      } else {
        toast.info(result.message);
      }

      if (result.erros > 0) {
        toast.error("Ocorreram alguns erros. Verifique o console para mais detalhes.");
      }
    },
    onError: (error) => {
      console.error("Erro ao gerar faturas:", error);
      toast.error("Erro ao gerar faturas. Verifique o console para mais detalhes.");
    },
  });
};
