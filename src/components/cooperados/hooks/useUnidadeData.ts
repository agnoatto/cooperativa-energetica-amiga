
/**
 * Hook para carregar os dados de uma unidade beneficiária existente
 * 
 * Este hook busca os dados da unidade no banco e configura o formulário
 * para edição, realizando as conversões de tipos necessárias.
 */

import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UnidadeBeneficiariaFormValues } from "../types";

export function useUnidadeData(
  form: UseFormReturn<UnidadeBeneficiariaFormValues>,
  unidadeId?: string
) {
  const [originalCooperadoId, setOriginalCooperadoId] = useState<string | null>(null);
  const [selectedCooperadoId, setSelectedCooperadoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchUnidade = async () => {
      if (!unidadeId) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('unidades_beneficiarias')
          .select('*')
          .eq('id', unidadeId)
          .single();

        if (error) throw error;

        if (data && isMounted) {
          // Armazenar o cooperado_id original para referência
          setOriginalCooperadoId(data.cooperado_id);
          setSelectedCooperadoId(data.cooperado_id);
          
          form.reset({
            numero_uc: data.numero_uc,
            apelido: data.apelido || "",
            cep: data.cep || "",
            logradouro: data.logradouro || "",
            numero: data.numero || "",
            complemento: data.complemento || "",
            bairro: data.bairro || "",
            cidade: data.cidade || "",
            uf: (data.uf as any) || undefined,
            // Convertendo números para strings
            percentual_desconto: data.percentual_desconto !== null ? data.percentual_desconto.toString() : "",
            consumo_kwh: data.consumo_kwh !== null ? data.consumo_kwh.toString() : "",
            data_entrada: new Date(data.data_entrada).toISOString().split('T')[0],
            data_saida: data.data_saida ? new Date(data.data_saida).toISOString().split('T')[0] : "",
            possui_geracao_propria: data.possui_geracao_propria || false,
            potencia_instalada: data.potencia_instalada,
            data_inicio_geracao: data.data_inicio_geracao ? new Date(data.data_inicio_geracao).toISOString().split('T')[0] : null,
            observacao_geracao: data.observacao_geracao,
            recebe_creditos_proprios: data.recebe_creditos_proprios || false,
            uc_origem_creditos: data.uc_origem_creditos,
            data_inicio_creditos: data.data_inicio_creditos ? new Date(data.data_inicio_creditos).toISOString().split('T')[0] : null,
            observacao_creditos: data.observacao_creditos,
            calculo_fatura_template_id: data.calculo_fatura_template_id || "",
          });
        }
      } catch (error: any) {
        if (isMounted) {
          toast.error("Erro ao carregar dados da unidade: " + error.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUnidade();

    return () => {
      isMounted = false;
    };
  }, [unidadeId, form]); 

  return {
    selectedCooperadoId,
    setSelectedCooperadoId,
    originalCooperadoId,
    isLoading
  };
}
