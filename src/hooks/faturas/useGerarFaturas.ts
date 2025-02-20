
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { lastDayOfMonth } from "date-fns";
import { UnidadeBeneficiaria } from "./types";

export const useGerarFaturas = (currentDate: Date) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      console.log("Iniciando geração de faturas...");
      
      const mes = currentDate.getMonth() + 1;
      const ano = currentDate.getFullYear();
      const ultimoDiaMes = lastDayOfMonth(currentDate).toISOString().split('T')[0];
      
      console.log(`Gerando faturas para ${mes}/${ano}`);
      console.log(`Último dia do mês: ${ultimoDiaMes}`);

      // Busca unidades elegíveis: ativas e com data_entrada <= último dia do mês
      const { data: unidades, error: unidadesError } = await supabase
        .from("unidades_beneficiarias")
        .select(`
          id,
          numero_uc,
          apelido,
          data_entrada,
          cooperado:cooperado_id (
            nome
          )
        `)
        .filter('data_saida', 'is', null)
        .lte('data_entrada', ultimoDiaMes);

      if (unidadesError) {
        console.error("Erro ao buscar unidades:", unidadesError);
        throw unidadesError;
      }

      console.log(`Encontradas ${unidades?.length || 0} unidades ativas com data_entrada <= ${ultimoDiaMes}`);

      if (!unidades || unidades.length === 0) {
        toast.info("Não há unidades elegíveis para geração de faturas neste mês.");
        return [];
      }

      // Prepara dados para geração das faturas
      const dataVencimento = lastDayOfMonth(currentDate);
      const now = new Date().toISOString();
      const historicoStatusInicial = [{
        status: "gerada" as const,
        data: now,
        observacao: "Fatura gerada automaticamente pelo sistema"
      }];

      // Processa cada unidade elegível
      const unidadesComFatura = await Promise.all(
        unidades.map(async (unidade) => {
          console.log(`Verificando unidade ${unidade.numero_uc}...`);

          try {
            // Verifica se já existe fatura para este mês/ano
            const { data: faturasExistentes } = await supabase
              .from("faturas")
              .select()
              .eq("unidade_beneficiaria_id", unidade.id)
              .eq("mes", mes)
              .eq("ano", ano);

            if (faturasExistentes && faturasExistentes.length > 0) {
              console.log(`Fatura já existe para unidade ${unidade.numero_uc} em ${mes}/${ano}`);
              return null;
            }

            // Gera nova fatura
            console.log(`Gerando fatura para unidade ${unidade.numero_uc}`);
            const { data: fatura, error: insertError } = await supabase
              .from("faturas")
              .insert({
                unidade_beneficiaria_id: unidade.id,
                mes,
                ano,
                consumo_kwh: 0,
                total_fatura: 0,
                status: "gerada",
                data_vencimento: dataVencimento.toISOString().split('T')[0],
                economia_acumulada: 0,
                economia_mes: 0,
                saldo_energia_kwh: 0,
                observacao: null,
                historico_status: historicoStatusInicial,
                fatura_concessionaria: 0,
                iluminacao_publica: 0,
                outros_valores: 0,
                valor_desconto: 0,
                valor_assinatura: 0,
                data_criacao: now,
                data_atualizacao: now
              })
              .select()
              .single();

            if (insertError) {
              console.error(`Erro ao gerar fatura para unidade ${unidade.numero_uc}:`, insertError);
              throw insertError;
            }

            console.log(`Fatura gerada com sucesso para unidade ${unidade.numero_uc}`);
            return { ...unidade, fatura };

          } catch (error) {
            console.error(`Erro ao processar unidade ${unidade.numero_uc}:`, error);
            throw error;
          }
        })
      );

      // Filtra apenas as faturas geradas com sucesso
      const faturasGeradas = unidadesComFatura.filter(Boolean);
      console.log(`Processo finalizado. ${faturasGeradas.length} faturas geradas com sucesso para ${mes}/${ano}`);

      return faturasGeradas;
    },
    onSuccess: (unidades) => {
      const count = unidades?.length || 0;
      queryClient.invalidateQueries({ queryKey: ["faturas"] });
      
      if (count > 0) {
        toast.success(`${count} faturas geradas com sucesso!`);
      } else {
        toast.info("Todas as faturas já foram geradas para este mês.");
      }
    },
    onError: (error) => {
      console.error("Erro ao gerar faturas:", error);
      toast.error("Erro ao gerar faturas. Verifique o console para mais detalhes.");
    },
  });
};
