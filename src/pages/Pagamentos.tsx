
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { lastDayOfMonth } from "date-fns";
import { toast } from "sonner";
import { MonthSelector } from "@/components/pagamentos/MonthSelector";
import { PagamentosHeader } from "@/components/pagamentos/PagamentosHeader";
import { PagamentosTable } from "@/components/pagamentos/PagamentosTable";
import { PagamentoEditModal } from "@/components/pagamentos/PagamentoEditModal";

interface Usina {
  id: string;
  unidade_usina: {
    numero_uc: string;
  };
  investidor: {
    nome_investidor: string;
  };
}

const Pagamentos = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPagamento, setSelectedPagamento] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: pagamentos, isLoading } = useQuery({
    queryKey: ["pagamentos", currentDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pagamentos_usina")
        .select(`
          id,
          geracao_kwh,
          valor_tusd_fio_b,
          conta_energia,
          valor_total,
          status,
          data_vencimento,
          data_pagamento,
          mes,
          ano,
          economia_mes,
          economia_acumulada,
          usina:usina_id (
            id,
            unidade_usina:unidade_usina_id (
              numero_uc
            ),
            investidor:investidor_id (
              nome_investidor
            )
          )
        `)
        .eq("mes", currentDate.getMonth() + 1)
        .eq("ano", currentDate.getFullYear());

      if (error) {
        toast.error("Erro ao carregar pagamentos");
        throw error;
      }

      return data;
    },
  });

  const gerarPagamentosMutation = useMutation({
    mutationFn: async () => {
      const { data: usinas, error: usinasError } = await supabase
        .from("usinas")
        .select(`
          id,
          unidade_usina:unidade_usina_id (
            numero_uc
          ),
          investidor:investidor_id (
            nome_investidor
          )
        `); // Removida a restrição .eq('status', 'active')

      if (usinasError) throw usinasError;

      const mes = currentDate.getMonth() + 1;
      const ano = currentDate.getFullYear();
      const dataVencimento = lastDayOfMonth(currentDate);

      const usinasComPagamento = await Promise.all(
        (usinas as Usina[]).map(async (usina) => {
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
              conta_energia: 0,
              valor_total: 0,
              status: "pendente",
              data_vencimento: dataVencimento.toISOString().split('T')[0],
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

  const handlePreviousMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const handleEditPagamento = (pagamento: any) => {
    setSelectedPagamento(pagamento);
  };

  return (
    <div className="space-y-6">
      <PagamentosHeader 
        onGerarPagamentos={() => gerarPagamentosMutation.mutate()}
        isGenerating={gerarPagamentosMutation.isPending}
      />

      <MonthSelector
        currentDate={currentDate}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
      />

      <PagamentosTable
        pagamentos={pagamentos}
        isLoading={isLoading}
        onEditPagamento={handleEditPagamento}
      />

      <PagamentoEditModal
        pagamento={selectedPagamento}
        isOpen={!!selectedPagamento}
        onClose={() => setSelectedPagamento(null)}
        onSave={() => {
          queryClient.invalidateQueries({ queryKey: ["pagamentos"] });
        }}
      />
    </div>
  );
};

export default Pagamentos;
