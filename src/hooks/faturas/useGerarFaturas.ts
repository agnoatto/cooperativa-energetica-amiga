
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { lastDayOfMonth, startOfMonth } from "date-fns";
import { UnidadeBeneficiaria } from "./types";
import { FaturaStatus } from "@/types/fatura";

interface NovaFatura {
  unidade_beneficiaria_id: string;
  mes: number;
  ano: number;
  consumo_kwh: number;
  total_fatura: number; // Corrigido: usando total_fatura em vez de valor_total
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
  historico_status: any[];
  data_criacao: string;
  data_atualizacao: string;
}

export const useGerarFaturas = (currentDate: Date) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        console.log("=== INÍCIO DO PROCESSO DE GERAÇÃO DE FATURAS ===");
        
        const mes = currentDate.getMonth() + 1;
        const ano = currentDate.getFullYear();
        const inicioDiaMes = startOfMonth(currentDate).toISOString();
        const ultimoDiaMes = lastDayOfMonth(currentDate).toISOString().split('T')[0];
        
        console.log(`Período de geração: ${mes}/${ano}`);
        console.log(`Data início: ${inicioDiaMes}`);
        console.log(`Data fim: ${ultimoDiaMes}`);

        // 1. Buscar unidades elegíveis
        console.log("\n=== BUSCANDO UNIDADES ELEGÍVEIS ===");
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
          .lte('data_entrada', ultimoDiaMes);

        if (unidadesError) {
          console.error("❌ Erro ao buscar unidades:", unidadesError);
          throw new Error(`Erro ao buscar unidades beneficiárias: ${unidadesError.message}`);
        }

        if (!unidades || unidades.length === 0) {
          console.log("ℹ️ Nenhuma unidade encontrada para o período");
          return { faturasGeradas: 0, message: "Não há unidades elegíveis para geração de faturas." };
        }

        console.log(`✅ ${unidades.length} unidades encontradas`);

        let faturasGeradas = 0;
        let erros = 0;
        let logErros: string[] = [];

        // 2. Processar cada unidade
        console.log("\n=== PROCESSANDO UNIDADES ===");
        for (const unidade of unidades) {
          try {
            console.log(`\nProcessando UC ${unidade.numero_uc}:`);

            // 2.1 Verificar fatura existente
            console.log("- Verificando fatura existente...");
            const { data: faturasExistentes, error: checkError } = await supabase
              .from("faturas")
              .select('id')
              .eq("unidade_beneficiaria_id", unidade.id)
              .eq("mes", mes)
              .eq("ano", ano);

            if (checkError) {
              const errorMsg = `Erro ao verificar fatura existente para UC ${unidade.numero_uc}: ${checkError.message}`;
              console.error("❌", errorMsg);
              logErros.push(errorMsg);
              erros++;
              continue;
            }

            if (faturasExistentes && faturasExistentes.length > 0) {
              console.log("ℹ️ Fatura já existe para esta unidade");
              continue;
            }

            // 2.2 Preparar dados da fatura
            console.log("- Preparando dados da fatura...");
            const novaFatura: NovaFatura = {
              unidade_beneficiaria_id: unidade.id,
              mes,
              ano,
              consumo_kwh: 0,
              total_fatura: 0, // Corrigido: usando total_fatura em vez de valor_total
              status: "gerada",
              data_vencimento: ultimoDiaMes,
              economia_acumulada: 0,
              economia_mes: 0,
              saldo_energia_kwh: 0,
              fatura_concessionaria: 0,
              iluminacao_publica: 0,
              outros_valores: 0,
              valor_desconto: 0,
              valor_assinatura: 0,
              historico_status: [{
                status: "gerada",
                data: new Date().toISOString(),
                observacao: "Fatura gerada automaticamente pelo sistema"
              }],
              data_criacao: new Date().toISOString(),
              data_atualizacao: new Date().toISOString()
            };

            // 2.3 Inserir fatura
            console.log("- Inserindo fatura no banco de dados...");
            console.log("Dados da fatura a ser inserida:", novaFatura);
            
            const { data: faturaInserida, error: insertError } = await supabase
              .from("faturas")
              .insert(novaFatura)
              .select()
              .maybeSingle();

            if (insertError) {
              const errorMsg = `Erro ao inserir fatura para UC ${unidade.numero_uc}: ${insertError.message}`;
              console.error("❌", errorMsg);
              console.error("Dados da fatura que causou erro:", novaFatura);
              logErros.push(errorMsg);
              erros++;
              continue;
            }

            if (!faturaInserida) {
              const errorMsg = `Fatura não foi inserida para UC ${unidade.numero_uc} - Nenhum erro retornado`;
              console.error("❌", errorMsg);
              logErros.push(errorMsg);
              erros++;
              continue;
            }

            console.log("✅ Fatura gerada com sucesso");
            faturasGeradas++;

          } catch (error) {
            const errorMsg = `Erro inesperado ao processar UC ${unidade.numero_uc}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`;
            console.error("❌", errorMsg);
            logErros.push(errorMsg);
            erros++;
          }
        }

        // 3. Relatório final
        console.log("\n=== RELATÓRIO FINAL ===");
        console.log(`✅ Faturas geradas com sucesso: ${faturasGeradas}`);
        console.log(`❌ Erros encontrados: ${erros}`);
        
        if (logErros.length > 0) {
          console.log("\n=== LISTA DE ERROS ENCONTRADOS ===");
          logErros.forEach((erro, index) => {
            console.log(`${index + 1}. ${erro}`);
          });
        }

        return {
          faturasGeradas,
          erros,
          logErros,
          message: erros > 0 
            ? `${faturasGeradas} faturas geradas com sucesso e ${erros} erros encontrados.`
            : `${faturasGeradas} faturas geradas com sucesso!`
        };
      } catch (error) {
        const errorMsg = `Erro crítico na geração de faturas: ${error instanceof Error ? error.message : 'Erro desconhecido'}`;
        console.error("❌", errorMsg);
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
        toast.error(`Ocorreram ${result.erros} erros durante a geração. Verifique o console para mais detalhes.`);
        console.log("\n=== ERROS DETALHADOS ===");
        result.logErros.forEach((erro, index) => {
          console.error(`${index + 1}. ${erro}`);
        });
      }
    },
    onError: (error) => {
      const errorMsg = `Erro ao gerar faturas: ${error instanceof Error ? error.message : 'Erro desconhecido'}`;
      console.error("❌", errorMsg);
      toast.error("Erro ao gerar faturas. Verifique o console para mais detalhes.");
    },
  });
};
