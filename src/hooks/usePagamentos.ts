
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { lastDayOfMonth } from "date-fns";
import { toast } from "sonner";
import { PagamentoData, PagamentoStatus } from "@/components/pagamentos/types/pagamento";

export const usePagamentos = (currentDate: Date) => {
  const queryClient = useQueryClient();

  const { data: pagamentos, isLoading } = useQuery({
    queryKey: ["pagamentos", currentDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("usinas")
        .select(`
          id,
          valor_kwh,
          unidade_usina:unidades_usina!inner(
            numero_uc
          ),
          investidor:investidores!inner(
            nome_investidor
          ),
          pagamentos:pagamentos_usina(
            id,
            geracao_kwh,
            tusd_fio_b,
            valor_tusd_fio_b,
            valor_concessionaria,
            valor_total,
            conta_energia,
            status,
            data_vencimento,
            data_pagamento,
            data_emissao,
            data_confirmacao,
            data_envio,
            mes,
            ano,
            arquivo_comprovante_nome,
            arquivo_comprovante_path,
            arquivo_comprovante_tipo,
            arquivo_comprovante_tamanho,
            observacao,
            observacao_pagamento,
            historico_status,
            send_method
          )
        `)
        .eq("deleted_at", null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erro ao carregar pagamentos:", error);
        toast.error("Erro ao carregar pagamentos");
        return [];
      }

      const mes = currentDate.getMonth() + 1;
      const ano = currentDate.getFullYear();

      return data.map(usina => {
        const pagamentoDoMes = usina.pagamentos?.find(p => p.mes === mes && p.ano === ano);
        
        if (pagamentoDoMes) {
          return {
            ...pagamentoDoMes,
            usina: {
              id: usina.id,
              valor_kwh: usina.valor_kwh,
              unidade_usina: usina.unidade_usina,
              investidor: usina.investidor
            },
            historico_status: Array.isArray(pagamentoDoMes.historico_status) 
              ? pagamentoDoMes.historico_status.map((h: any) => ({
                  data: h.data,
                  status_anterior: h.status_anterior as PagamentoStatus,
                  novo_status: h.novo_status as PagamentoStatus
                }))
              : []
          };
        }

        // Se não houver pagamento para o mês, cria um registro zerado
        return {
          id: crypto.randomUUID(),
          geracao_kwh: 0,
          tusd_fio_b: 0,
          valor_tusd_fio_b: 0,
          valor_concessionaria: 0,
          valor_total: 0,
          conta_energia: 0,
          status: "pendente" as PagamentoStatus,
          data_vencimento: lastDayOfMonth(currentDate).toISOString().split('T')[0],
          data_pagamento: null,
          data_emissao: null,
          data_confirmacao: null,
          data_envio: null,
          mes,
          ano,
          arquivo_comprovante_nome: null,
          arquivo_comprovante_path: null,
          arquivo_comprovante_tipo: null,
          arquivo_comprovante_tamanho: null,
          observacao: null,
          observacao_pagamento: null,
          historico_status: [],
          send_method: null,
          usina: {
            id: usina.id,
            valor_kwh: usina.valor_kwh,
            unidade_usina: usina.unidade_usina,
            investidor: usina.investidor
          }
        } as PagamentoData;
      });
    },
  });

  const gerarPagamentosMutation = useMutation({
    mutationFn: async () => {
      const { data: usinas, error: usinasError } = await supabase
        .from("usinas")
        .select(`
          id,
          unidade_usina:unidades_usina!inner(
            numero_uc
          ),
          investidor:investidores!inner(
            nome_investidor
          )
        `);

      if (usinasError) throw usinasError;

      const mes = currentDate.getMonth() + 1;
      const ano = currentDate.getFullYear();
      const dataVencimento = lastDayOfMonth(currentDate);

      const usinasComPagamento = await Promise.all(
        (usinas as any[]).map(async (usina) => {
          const { data: pagamentosExistentes } = await supabase
            .from("pagamentos_usina")
            .select()
            .eq("usina_id", usina.id)
            .eq("mes", mes)
            .eq("ano", ano);

          if (pagamentosExistentes && pagamentosExistentes.length > 0) {
            return null;
          }

          const { error: insertError } = await supabase
            .from("pagamentos_usina")
            .insert({
              usina_id: usina.id,
              mes,
              ano,
              geracao_kwh: 0,
              valor_tusd_fio_b: 0,
              valor_concessionaria: 0,
              valor_total: 0,
              conta_energia: 0,
              status: "pendente",
              data_vencimento: dataVencimento.toISOString().split('T')[0],
              data_emissao: null,
              data_pagamento: null,
              historico_status: [],
              observacao: null,
              observacao_pagamento: null
            });

          if (insertError) throw insertError;
          return usina;
        })
      );

      return usinasComPagamento.filter(Boolean);
    },
    onSuccess: (usinas) => {
      const count = usinas?.length || 0;
      queryClient.invalidateQueries({ queryKey: ["pagamentos"] });
      if (count > 0) {
        toast.success(`${count} pagamentos gerados com sucesso!`);
      } else {
        toast.info("Todos os pagamentos já foram gerados para este mês.");
      }
    },
    onError: (error) => {
      console.error("Erro ao gerar pagamentos:", error);
      toast.error("Erro ao gerar pagamentos");
    },
  });

  return {
    pagamentos,
    isLoading,
    gerarPagamentos: () => gerarPagamentosMutation.mutate(),
    isGenerating: gerarPagamentosMutation.isPending
  };
};
