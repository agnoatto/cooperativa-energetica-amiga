
/**
 * Hook para gerenciar o envio do formulário de unidade beneficiária
 * 
 * Este hook implementa a lógica de submissão do formulário,
 * realizando as conversões de tipos necessárias e enviando ao banco.
 */

import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UnidadeBeneficiariaFormValues } from "../types";

interface UseUnidadeFormSubmitProps {
  unidadeId?: string;
  selectedCooperadoId: string | null;
  originalCooperadoId: string | null;
  onSuccess?: () => void;
  onOpenChange: (open: boolean) => void;
}

export function useUnidadeFormSubmit({
  unidadeId,
  selectedCooperadoId,
  originalCooperadoId,
  onSuccess,
  onOpenChange,
}: UseUnidadeFormSubmitProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: UnidadeBeneficiariaFormValues) => {
    if (!selectedCooperadoId) {
      toast.error("Selecione um cooperado");
      return;
    }

    setIsSubmitting(true);
    try {
      const endereco = `${data.logradouro}, ${data.numero}${data.complemento ? `, ${data.complemento}` : ''} - ${data.bairro}, ${data.cidade} - ${data.uf}, ${data.cep}`;
      
      const unidadeData = {
        cooperado_id: selectedCooperadoId,
        numero_uc: data.numero_uc,
        apelido: data.apelido || null,
        endereco: endereco,
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: data.complemento || null,
        bairro: data.bairro,
        cidade: data.cidade,
        uf: data.uf,
        cep: data.cep,
        // Convertendo strings para números no momento de salvar
        consumo_kwh: data.consumo_kwh ? parseFloat(data.consumo_kwh) : null,
        percentual_desconto: parseFloat(data.percentual_desconto),
        data_entrada: new Date(data.data_entrada).toISOString(),
        data_saida: data.data_saida ? new Date(data.data_saida).toISOString() : null,
        possui_geracao_propria: data.possui_geracao_propria,
        potencia_instalada: data.potencia_instalada,
        data_inicio_geracao: data.data_inicio_geracao ? new Date(data.data_inicio_geracao).toISOString() : null,
        observacao_geracao: data.observacao_geracao,
        recebe_creditos_proprios: data.recebe_creditos_proprios,
        uc_origem_creditos: data.uc_origem_creditos,
        data_inicio_creditos: data.data_inicio_creditos ? new Date(data.data_inicio_creditos).toISOString() : null,
        observacao_creditos: data.observacao_creditos,
        calculo_fatura_template_id: data.calculo_fatura_template_id || null,
      };

      console.log("Dados da unidade para salvar:", unidadeData);

      if (unidadeId) {
        // Verificar se houve mudança de cooperado
        const cooperadoMudou = originalCooperadoId !== selectedCooperadoId;
        
        const { error } = await supabase
          .from('unidades_beneficiarias')
          .update(unidadeData)
          .eq('id', unidadeId);

        if (error) throw error;
        
        if (cooperadoMudou) {
          toast.success("Unidade beneficiária transferida para outro cooperado com sucesso!");
        } else {
          toast.success("Unidade beneficiária atualizada com sucesso!");
        }
      } else {
        const { error } = await supabase
          .from('unidades_beneficiarias')
          .insert(unidadeData);

        if (error) throw error;
        toast.success("Unidade beneficiária cadastrada com sucesso!");
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(`Erro ao ${unidadeId ? 'atualizar' : 'cadastrar'} unidade beneficiária: ` + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    onSubmit,
    isSubmitting,
  };
}
