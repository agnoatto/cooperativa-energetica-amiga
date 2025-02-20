
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { lastDayOfMonth, startOfMonth, format, parseISO } from "date-fns";
import { validarMesFuturo, filtrarUnidadesElegiveis, criarNovaFatura } from "./utils/gerarFaturasUtils";
import { buscarUnidadesElegiveis, verificarFaturaExistente, inserirFatura } from "./services/faturasService";
import { ResultadoGeracaoFaturas } from "./types/gerarFaturas";

export const useGerarFaturas = (currentDate: Date) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<ResultadoGeracaoFaturas> => {
      try {
        console.log("=== INÍCIO DO PROCESSO DE GERAÇÃO DE FATURAS ===");
        
        const mes = currentDate.getMonth() + 1;
        const ano = currentDate.getFullYear();
        const inicioDiaMes = startOfMonth(currentDate).toISOString();
        const ultimoDiaMes = lastDayOfMonth(currentDate).toISOString().split('T')[0];
        
        console.log(`Período de geração: ${mes}/${ano}`);
        console.log(`Data início: ${inicioDiaMes}`);
        console.log(`Data fim: ${ultimoDiaMes}`);

        // Validar mês futuro
        validarMesFuturo(currentDate);

        // 1. Buscar unidades elegíveis
        console.log("\n=== BUSCANDO UNIDADES ELEGÍVEIS ===");
        const unidades = await buscarUnidadesElegiveis(ultimoDiaMes);

        if (!unidades || unidades.length === 0) {
          console.log("ℹ️ Nenhuma unidade encontrada para o período");
          return { 
            faturasGeradas: 0, 
            erros: 0,
            logErros: [],
            message: "Não há unidades elegíveis para geração de faturas." 
          };
        }

        // Filtrar unidades com data_entrada válida
        const unidadesElegiveis = filtrarUnidadesElegiveis(unidades, mes, ano);

        if (unidadesElegiveis.length === 0) {
          console.log("ℹ️ Nenhuma unidade elegível encontrada após filtro de data_entrada");
          return { 
            faturasGeradas: 0,
            erros: 0,
            logErros: [],
            message: "Não há unidades elegíveis para geração de faturas no período selecionado." 
          };
        }

        console.log(`✅ ${unidadesElegiveis.length} unidades elegíveis encontradas`);

        let faturasGeradas = 0;
        let erros = 0;
        let logErros: string[] = [];

        // 2. Processar cada unidade
        console.log("\n=== PROCESSANDO UNIDADES ===");
        for (const unidade of unidadesElegiveis) {
          try {
            console.log(`\nProcessando UC ${unidade.numero_uc}:`);
            console.log(`Data de entrada: ${format(parseISO(unidade.data_entrada), 'dd/MM/yyyy')}`);

            // 2.1 Verificar fatura existente
            console.log("- Verificando fatura existente...");
            const faturasExistentes = await verificarFaturaExistente(unidade.id, mes, ano);

            if (faturasExistentes && faturasExistentes.length > 0) {
              console.log("ℹ️ Fatura já existe para esta unidade");
              continue;
            }

            // 2.2 Preparar e inserir nova fatura
            console.log("- Preparando e inserindo nova fatura...");
            const novaFatura = criarNovaFatura(unidade.id, mes, ano, ultimoDiaMes);
            console.log("Dados da fatura a ser inserida:", novaFatura);
            
            const faturaInserida = await inserirFatura(novaFatura);

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
      toast.error(errorMsg);
    },
  });
};
